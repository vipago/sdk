import { codes as currencyCodes } from "currency-codes-ts";
import type { CurrencyCode } from "currency-codes-ts/dist/types";
import { Duration, Schema } from "effect";
import { idSchema } from "../../idGenerator";
import { ExpandableProductId } from "./products";
import { DateMaybeFromString } from "../DateMaybeFromString";
export namespace BillingMode {
	const Recurring = Schema.TaggedStruct("recurring", {
		recurringInterval: Schema.DurationFromMillis,
	}).annotations({
		title: "recurring",
	});
	const OneShot = Schema.TaggedStruct("one_shot", {}).annotations({
		title: "one_shot",
	});

	export const BillingMode = Schema.Union(Recurring, OneShot).annotations({
		examples: [oneShot()],
	});
	export function oneShot(): typeof OneShot.Type {
		return { _tag: "one_shot" };
	}
	export function recurring(
		duration: Duration.DurationInput,
	): typeof Recurring.Type {
		return {
			_tag: "recurring",
			recurringInterval: Duration.decode(duration),
		};
	}
}

export const CurrencyCodeSchema = Schema.Union(
	...currencyCodes().map(v => Schema.Literal(v)),
).annotations({
	examples: ["EUR", "BRL"],
});

export const CurrencyToPricesMap = Schema.Record({
	key: CurrencyCodeSchema,
	value: Schema.BigDecimal,
})
	.pipe(Schema.partial)
	.annotations({
		examples: [
			{
				USD: "10.00",
				EUR: "8.70",
			} as any,
		],
	});

const checkDefaultCurrency = (price: {
	defaultCurrency: CurrencyCode;
	currencyToPrice: typeof CurrencyToPricesMap.Type;
}) =>
	price.currencyToPrice[price.defaultCurrency] == null
		? "Default currency amount was not found in the currency-amounts map"
		: undefined;

export const PriceId = idSchema("price", "preço");

export const GetPriceResponseSchema = Schema.Struct({
	id: PriceId,
	active: Schema.Boolean,
	productId: ExpandableProductId,
	billingMode: BillingMode.BillingMode,
	currencyToPrice: CurrencyToPricesMap,
	defaultCurrency: CurrencyCodeSchema,
	createdAt: DateMaybeFromString,
	updatedAt: DateMaybeFromString,
});
export const ExpandablePriceId = Schema.Union(PriceId, GetPriceResponseSchema);
export type GetPriceResponse = typeof GetPriceResponseSchema.Type;

export const CreatePriceRequestSchema = Schema.Struct({
	billingMode: BillingMode.BillingMode,
	currencyToPrice: CurrencyToPricesMap,
	defaultCurrency: CurrencyCodeSchema,
})
	.pipe(Schema.filter(checkDefaultCurrency))
	.annotations({
		jsonSchema: {},
	});

export type CreatePriceRequest = typeof CreatePriceRequestSchema.Type;

export const EditPriceRequestSchema = Schema.Struct({
	billingMode: BillingMode.BillingMode,
	currencyToPrice: CurrencyToPricesMap,
	active: Schema.Boolean,
	defaultCurrency: CurrencyCodeSchema,
}).pipe(Schema.partial);
export type EditPriceRequest = typeof EditPriceRequestSchema.Type;
