import { Schema } from "effect";
import { idSchema } from "../idGenerator";
import { GetCustomerResponseSchema } from "./customer";
import { CurrencyCodeSchema } from "./products/prices";
import { GetWorkspaceResponseSchema } from "./workspace";

export namespace PaymentMethod {
	export const AvailableType = Schema.Literal("card", "paypal", "pix");

	export const Card = Schema.TaggedStruct("card", {
		gatewaySpecificData: Schema.Union(
			Schema.TaggedStruct("stripe", {
				stripePaymentMethodId: Schema.String,
			}),
		),
		last4Digits: Schema.String,
	}).annotations({
		title: "Cartão",
	});

	// Union of all payment method types (currently only Stripe, since PayPal and PIX don't need storage)
	export const PaymentMethod = Schema.Union(Card).annotations({
		examples: [
			{
				_tag: "card",
				gatewaySpecificData: {
					_tag: "stripe",
					stripePaymentMethodId: "pm_card_visa",
				},
				last4Digits: "4242",
			},
		],
	});
}
export namespace NewPaymentMethodDetails {
	export const Card = Schema.TaggedStruct("card", {
		cardNumber: Schema.String,
		expiryMonth: Schema.Number,
		expiryYear: Schema.Number,
		cvc: Schema.String,
		cardholderName: Schema.String,
		address: Schema.Struct({
			line1: Schema.String,
			line2: Schema.String,
			city: Schema.String,
			state: Schema.String,
			postalCode: Schema.String,
			country: Schema.String,
		}),
	}).annotations({
		title: "Cartão",
	});
	export const NewPaymentMethodDetails = Schema.Union(Card);
	export type NewPaymentMethodDetails = typeof NewPaymentMethodDetails.Type;
}
// Schema for the payment method record in the database
export const GetPaymentMethodResponseSchema = Schema.Struct({
	id: idSchema("pm", "Método de Pagamento"),
	customerId: Schema.Union(
		idSchema("cust", "Cliente"),
		GetCustomerResponseSchema,
	),
	workspaceId: Schema.Union(
		idSchema("wosp", "Workspace"),
		GetWorkspaceResponseSchema,
	),
	data: PaymentMethod.PaymentMethod, // The actual payment method data (only Stripe for now)
	deleted: Schema.Boolean,
});

export type GetPaymentMethodResponse =
	typeof GetPaymentMethodResponseSchema.Type;

// Schema for creating a new payment method
export const CreatePaymentMethodRequestSchema = Schema.Struct({
	customerId: idSchema("cust", "Cliente"),
	hints: Schema.Struct({
		paymentAmount: Schema.optional(Schema.BigDecimal),
		currency: Schema.optional(CurrencyCodeSchema),
	}).pipe(Schema.optional),
}).pipe(Schema.extend(NewPaymentMethodDetails.NewPaymentMethodDetails));

export type CreatePaymentMethodRequest =
	typeof CreatePaymentMethodRequestSchema.Type;

// Schema for editing an existing payment method
export const EditPaymentMethodRequestSchema = Schema.Struct({
	data: NewPaymentMethodDetails.NewPaymentMethodDetails.pipe(Schema.optional), // Optional: Update the payment method data
	deleted: Schema.Boolean.pipe(Schema.optional),
}).pipe(Schema.partial);

export type EditPaymentMethodRequest =
	typeof EditPaymentMethodRequestSchema.Type;

// Schema for listing payment methods
export const ListPaymentMethodsResponseSchema =
	GetPaymentMethodResponseSchema.pipe(Schema.Array);

export type ListPaymentMethodsResponse =
	typeof ListPaymentMethodsResponseSchema.Type;
