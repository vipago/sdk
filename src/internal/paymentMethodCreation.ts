import { Schema } from "effect";
import { idSchema } from "../idGenerator";
import {
	GetPaymentMethodResponseSchema,
	NewPaymentMethodDetails,
	PaymentMethod,
} from "../models/paymentMethods";
export namespace PaymentMethodCreation {
	export namespace ClientPacket {
		export class PaymentMethodRequest extends Schema.TaggedClass<PaymentMethodRequest>(
			"ClientPacket.PaymentMethodRequest",
		)("paymentMethodRequest", {
			paymentMethodName: Schema.NonEmptyString,
			customerId: idSchema("cust", "Cliente"),
		}) {}
		export class PaymentMethodCreationResponse extends Schema.TaggedClass<PaymentMethodCreationResponse>(
			"ClientPacket.PaymentMethodCreationResponse",
		)("paymentMethodCreationResponse", {
			payment: PaymentMethod.PaymentMethod,
		}) {}
		export class NextGateway extends Schema.TaggedClass<NextGateway>(
			"ClientPacket.NextGateway",
		)("nextGateway", {}) {}

		export class GetPaymentMethodDetailsResponse extends Schema.TaggedClass<GetPaymentMethodDetailsResponse>(
			"GetPaymentMethodDetailsResponse",
		)("getPaymentMethodDetailsResponse", {
			newPaymentMethod: NewPaymentMethodDetails.NewPaymentMethodDetails,
		}) {}
		export const Packet = Schema.Union(
			PaymentMethodRequest,
			PaymentMethodCreationResponse,
			NextGateway,
			GetPaymentMethodDetailsResponse,
		);
	}
	export namespace ServerPacket {
		export class GatewayRequest extends Schema.TaggedClass<GatewayRequest>(
			"ServerGatewayRequest",
		)("serverGatewayRequest", {
			gatewayInternalName: Schema.NonEmptyString,
			apiKey: Schema.NonEmptyString.pipe(
				Schema.optionalWith({ nullable: true }),
			),
		}) {}
		export class Done extends Schema.TaggedClass<Done>("Done")("done", {
			paymentMethod: GetPaymentMethodResponseSchema,
		}) {}
		export class NoMoreGatewaysLeft extends Schema.TaggedClass<NoMoreGatewaysLeft>(
			"NoMoreGatewaysLeft",
		)("noMoreGatewaysLeft", {}) {}
		export class CustomerNotFound extends Schema.TaggedClass<CustomerNotFound>(
			"CustomerNotFound",
		)("customerNotFound", {}) {}

		export class GetPaymentMethodDetailsRequest extends Schema.TaggedClass<GetPaymentMethodDetailsRequest>(
			"GetPaymentMethodDetailsRequest",
		)("GetPaymentMethodDetailsRequest", {}) {}
		export const Packet = Schema.Union(
			GatewayRequest,
			Done,
			NoMoreGatewaysLeft,
			GetPaymentMethodDetailsRequest,
			CustomerNotFound,
		);
	}
}
