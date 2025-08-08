import {
	FetchHttpClient,
	HttpClient,
	HttpClientRequest,
} from "@effect/platform";
import {
	Config,
	Data,
	Effect,
	Fiber,
	Logger,
	Option,
	Schema,
	Sink,
	Stream,
} from "effect";
import { NetworkError } from "../error";
import { genericHttpClient } from "../internal/httpClient";
import { PaymentMethodCreation } from "../internal/paymentMethodCreation";
import { createEffectWebsocket } from "../internal/websocket";
import type { NewPaymentMethodDetails } from "../models/paymentMethods";

const createStripeCardPaymentMethod = Effect.fn(
	"createStripeCardPaymentMethod",
)(
	function* (card: typeof NewPaymentMethodDetails.Card.Type, key: string) {
		const httpClient = yield* HttpClient.HttpClient;
		const response = yield* httpClient.execute(
			HttpClientRequest.post("https://api.stripe.com/v1/payment_methods").pipe(
				HttpClientRequest.bodyUrlParams(
					new URLSearchParams({
						type: "card",
						"card[number]": card.cardNumber,
						"card[cvc]": card.cvc,
						"card[exp_month]": card.expiryMonth.toString(),
						"card[exp_year]": card.expiryYear.toString(),
						"billing_details[name]": card.cardholderName,
						"billing_details[address][line1]": card.address.line1,
						"billing_details[address][line2]": card.address.line2,
						"billing_details[address][city]": card.address.city,
						"billing_details[address][state]": card.address.state,
						"billing_details[address][postal_code]": card.address.postalCode,
						"billing_details[address][country]": card.address.country,
						payment_user_agent:
							"stripe.js/d16ff171ee; stripe-js-v3/d16ff171ee; card-element",
						key,
					}),
				),
			),
		);
		const paymentMethodResult = yield* response.json.pipe(
			Effect.andThen(
				Schema.decodeUnknown(Schema.Struct({ id: Schema.NonEmptyString })),
			),
		);
		return paymentMethodResult.id;
	},
	Effect.provideServiceEffect(HttpClient.HttpClient, genericHttpClient),
	Effect.provide(FetchHttpClient.layer),
);

export const createPaymentMethod = Effect.fn(
	"WS /api/v1/payment-methods/create",
)(
	function* (
		customerId: `cust_${string}`,
		options: NewPaymentMethodDetails.NewPaymentMethodDetails,
	) {
		const unsafeMode = yield* Config.boolean("VIPAGO_UNSAFE_MODE").pipe(
			Config.withDefault(() => false),
		);
		if (!unsafeMode && typeof document === "undefined") {
			yield* Effect.dieMessage(
				"Não é recomendado criar métodos de pagamento fora do navegador. Para criar um método de pagamento você precisa ter os dados do método de pagamento na memória, o que faz você entrar em PCI scope. Configure a variavel de ambiente `VIPAGO_UNSAFE_MODE=true` se deseja prosseguir mesmo assim.",
			);
		}
		const apiUrl = (yield* Config.string("VIPAGO_API_URL").pipe(
			Effect.catchAll(() =>
				Effect.gen(function* () {
					yield* Effect.logDebug("Assuming production API URL");
					return "https://api.vipago.com";
				}),
			),
		))
			.replace(/^http:\/\//, "ws://")
			.replace(/^https:\/\//, "wss://");
		const { ws, serverPacketStream: rawServerPacketStream } =
			yield* createEffectWebsocket(apiUrl + "/api/v1/payment-methods/create");
		const serverPacketStream = rawServerPacketStream.pipe(
			Stream.mapEffect(
				Schema.decode(
					Schema.parseJson(PaymentMethodCreation.ServerPacket.Packet),
				),
			),
		);
		const sendPacket = Effect.fn("sendPacket")(function* (
			packet: typeof PaymentMethodCreation.ClientPacket.Packet.Type,
		) {
			ws.send(
				yield* Schema.encode(
					Schema.parseJson(PaymentMethodCreation.ClientPacket.Packet),
				)(packet),
			);
		});

		yield* sendPacket(
			new PaymentMethodCreation.ClientPacket.PaymentMethodRequest({
				customerId,
				paymentMethodName: options._tag,
			}),
		);
		const gatewayRequestPackets = serverPacketStream.pipe(
			Stream.filter(
				Schema.is(PaymentMethodCreation.ServerPacket.GatewayRequest),
			),
		);
		const paymentMethodDetailsRequestPackets = serverPacketStream.pipe(
			Stream.filter(
				Schema.is(
					PaymentMethodCreation.ServerPacket.GetPaymentMethodDetailsRequest,
				),
			),
		);
		const waitEndPacket = serverPacketStream.pipe(
			Stream.filter(
				Schema.is(
					Schema.Union(
						PaymentMethodCreation.ServerPacket.Done,
						PaymentMethodCreation.ServerPacket.NoMoreGatewaysLeft,
						PaymentMethodCreation.ServerPacket.CustomerNotFound,
					),
				),
			),
			Stream.run(Sink.head()),
			Effect.andThen(Option.getOrNull),
		);
		const handleGatewayRequests = gatewayRequestPackets.pipe(
			Stream.runForEach(
				Effect.fnUntraced(
					function* (gwReq) {
						switch (gwReq.gatewayInternalName) {
							case "stripe": {
								const stripePublicKey = gwReq.apiKey;
								const paymentMethodResult =
									yield* createStripeCardPaymentMethod(
										options,
										stripePublicKey!,
									);
								yield* sendPacket(
									new PaymentMethodCreation.ClientPacket.PaymentMethodCreationResponse(
										{
											payment: {
												_tag: "card",
												gatewaySpecificData: {
													_tag: "stripe",
													stripePaymentMethodId: paymentMethodResult,
												},
												last4Digits: options.cardNumber.slice(3 * 4),
											},
										},
									),
								);
								break;
							}
						}
					},
					Effect.catchAll(() =>
						sendPacket(new PaymentMethodCreation.ClientPacket.NextGateway()),
					),
				),
			),
		);
		const handlePMDetailsRequest = paymentMethodDetailsRequestPackets.pipe(
			Stream.runForEach(() =>
				sendPacket(
					new PaymentMethodCreation.ClientPacket.GetPaymentMethodDetailsResponse(
						{
							newPaymentMethod: options,
						},
					),
				),
			),
		);
		const handlersFiber = yield* Effect.forkAll([
			handleGatewayRequests,
			handlePMDetailsRequest,
		]);
		const endPacket = yield* waitEndPacket;
		ws.close();
		yield* Fiber.interrupt(handlersFiber);
		if (Schema.is(PaymentMethodCreation.ServerPacket.Done)(endPacket)) {
			return endPacket.paymentMethod;
		}
		if (
			Schema.is(PaymentMethodCreation.ServerPacket.NoMoreGatewaysLeft)(
				endPacket,
			)
		) {
			return yield* new NoSuitableGatewaysError();
		}
		if (
			Schema.is(PaymentMethodCreation.ServerPacket.CustomerNotFound)(endPacket)
		) {
			return yield* new CustomerNotFound();
		}
		return yield* new NetworkError();
	},
	Effect.scoped,
	Effect.provide(Logger.pretty),
);

export class NoSuitableGatewaysError extends Data.TaggedError(
	"NoSuitableGatewaysError",
) {}

export class CustomerNotFound extends Data.TaggedError("CustomerNotFound") {}
