import { Schema } from "effect";
import { idSchema } from "../idGenerator";
import { CustomerId, ExpandableCustomerId } from "./customer";
import { CurrencyCodeSchema } from "./products/prices";
import { ExpandableWorkspaceId } from "./workspace";

export namespace PaymentMethod {
	export const AvailableType = Schema.Literal("card", "paypal", "pix");

	export const Card = Schema.TaggedStruct("card", {
		gatewaySpecificData: Schema.Union(
			Schema.TaggedStruct("stripe", {
				stripePaymentMethodId: Schema.NonEmptyString,
			}),
		),
		last4Digits: Schema.NonEmptyString,
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
		cardNumber: Schema.NonEmptyString,
		expiryMonth: Schema.Number,
		expiryYear: Schema.Number,
		cvc: Schema.NonEmptyString,
		cardholderName: Schema.NonEmptyString,
		address: Schema.Struct({
			line1: Schema.NonEmptyString,
			line2: Schema.NonEmptyString,
			city: Schema.NonEmptyString,
			state: Schema.NonEmptyString,
			postalCode: Schema.NonEmptyString,
			country: Schema.NonEmptyString,
		}),
	}).annotations({
		title: "Cartão",
	});
	export const NewPaymentMethodDetails = Schema.Union(Card);
	export type NewPaymentMethodDetails = typeof NewPaymentMethodDetails.Type;
}

export const PaymentMethodId = idSchema("pm", "Método de Pagamento");

export const GetPaymentMethodResponseSchema = Schema.Struct({
	id: PaymentMethodId,
	customerId: ExpandableCustomerId,
	workspaceId: ExpandableWorkspaceId,
	data: PaymentMethod.PaymentMethod, // The actual payment method data (only Stripe for now)
	deleted: Schema.Boolean,
});
export const ExpandablePaymentMethodId = Schema.Union(
	PaymentMethodId,
	GetPaymentMethodResponseSchema,
);
export type GetPaymentMethodResponse =
	typeof GetPaymentMethodResponseSchema.Type;

// Schema for creating a new payment method
export const CreatePaymentMethodRequestSchema = Schema.Struct({
	customerId: CustomerId,
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
