import { BigDecimal, Schema } from "effect";
import { idSchema } from "../idGenerator";
import { CustomerId, ExpandableCustomerId } from "./customer";
import { CurrencyCodeSchema, PriceId } from "./products/prices";
import { DateMaybeFromString } from "./DateMaybeFromString";
import { PaymentMethodId } from "./paymentMethods";
import { WorkspaceId } from "./workspace";
import { SubscriptionId } from "./subscriptions";
import { TrackId } from "./tracks";
export const OutInvoiceDetailsSchema = Schema.Union(
	Schema.TaggedStruct("NormalItem", {
		price: PriceId,
		quantity: Schema.Int,
	}),
	Schema.TaggedStruct("RecurringWithTrack", {
		plan: Schema.String,
		trackId: TrackId,
	}),
);
export const InInvoiceDetailsSchema = Schema.Struct({
	price: PriceId,
	quantity: Schema.Int,
}).pipe(
	Schema.extend(
		Schema.Union(
			Schema.Struct({
				plan: Schema.String,
				trackId: TrackId,
			}),
			Schema.Struct({}),
		),
	),
);
export const InvoiceStatusSchema = Schema.Literal(
	"pending",
	"expired",
	"paid",
	"cancelled",
	"refunded",
);
export const InvoiceId = idSchema("inv", "fatura");
export const GetInvoiceResponseSchema = Schema.Struct({
	id: InvoiceId,
	amount: Schema.BigDecimal,
	currency: CurrencyCodeSchema,
	status: InvoiceStatusSchema,
	paymentMethodId: Schema.String.pipe(Schema.optionalWith({ nullable: true })),
	customerId: ExpandableCustomerId,
	expiresAt: Schema.optional(DateMaybeFromString),
	createdAt: Schema.optional(DateMaybeFromString),
	updatedAt: Schema.optional(DateMaybeFromString),
	details: Schema.Array(InInvoiceDetailsSchema),
});
export const ExpandableInvoiceId = Schema.Union(
	InvoiceId,
	GetInvoiceResponseSchema,
);
export const CreateInvoiceRequestSchema = Schema.Struct({
	amount: Schema.BigDecimal.pipe(
		Schema.annotations({
			description:
				"O valor da fatura na moeda especificada. Se não for especificada, por padrão vai ser a soma do valor de todos os preços nos `details`.",
			examples: [BigDecimal.unsafeFromNumber(16.5)],
		}),
		Schema.optional,
	),
	currency: CurrencyCodeSchema,
	paymentMethodId: PaymentMethodId.pipe(Schema.optional),
	customerId: CustomerId,
	expiresAt: Schema.optional(DateMaybeFromString),
	description: Schema.optional(Schema.NonEmptyString),
	details: OutInvoiceDetailsSchema.pipe(Schema.Array, Schema.optional),
	tryCollectingPaymentImmediately: Schema.Boolean.pipe(
		Schema.annotations({
			description:
				"Se o método de pagamento suportar, tenta automaticamente pagar a fatura usando o método de pagamento especificado.\n" +
				"\n" +
				"Caso esta opção esteja desativada ou não for possivel concluir o pagamento automaticamente, um email será enviado ao cliente para realizar o pagamento manualmente.\n",
		}),
		Schema.propertySignature,
		Schema.withConstructorDefault(() => true),
	),
});

export const PayInvoiceRequestSchema = Schema.Struct({
	paymentMethodId: Schema.String.pipe(Schema.optional),
});
export const PayInvoiceResponseSchema = Schema.Union(
	Schema.Struct({
		id: Schema.NonEmptyString,
		charged: Schema.Literal(false),
		confirmationUrl: Schema.optional(Schema.NonEmptyString),
		qrCode: Schema.optional(Schema.NonEmptyString),
	}),
	Schema.Struct({
		id: Schema.NonEmptyString,
		charged: Schema.Literal(true),
	}),
);
export const InvoiceListResultSchema = Schema.Struct({
	items: Schema.Array(GetInvoiceResponseSchema),
	totalPages: Schema.Number,
});

export const InvoiceListOptions = Schema.Struct({
	page: Schema.NumberFromString.pipe(
		Schema.annotations({
			description: "Número da página para paginação (começando em 0)",
		}),
		Schema.propertySignature,
		Schema.withConstructorDefault(() => 0),
	),
	itemsPerPage: Schema.NumberFromString.pipe(
		Schema.annotations({
			description: "Quantidade de itens por página",
		}),
		Schema.propertySignature,
		Schema.withConstructorDefault(() => 30),
	),
	workspaceId: WorkspaceId.pipe(
		Schema.annotations({
			description: "Filtrar faturas por workspace ID",
		}),
		Schema.optional,
	),
	customerId: CustomerId.pipe(
		Schema.annotations({
			description: "Filtrar faturas por ID do cliente",
		}),
		Schema.optional,
	),
	externalCustomerId: Schema.NonEmptyString.pipe(
		Schema.annotations({
			description: "Filtrar faturas pelo ID externo do cliente",
		}),
		Schema.optional,
	),
	subscriptionId: SubscriptionId.pipe(Schema.optional),
});

export type InvoiceDetails = typeof OutInvoiceDetailsSchema.Type;
export type InvoiceStatus = typeof InvoiceStatusSchema.Type;
export type GetInvoiceResponse = typeof GetInvoiceResponseSchema.Type;
export type CreateInvoiceRequest = typeof CreateInvoiceRequestSchema.Type;
export type PayInvoiceRequest = typeof PayInvoiceRequestSchema.Type;
export type PayInvoiceResponse = typeof PayInvoiceResponseSchema.Type;
export type InvoiceListResult = typeof InvoiceListResultSchema.Type;
export type InvoiceListOptionsType = typeof InvoiceListOptions.Type;
