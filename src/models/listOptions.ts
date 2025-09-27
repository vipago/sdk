import { Schema } from "effect";
import { SortingStateSchema } from "./sorting";

export const LargeListOptions = {
	page: Schema.NumberFromString.pipe(
		Schema.int(),
		Schema.nonNegative(),
		Schema.propertySignature,
		Schema.withConstructorDefault(() => 0),
	),
	itemsPerPage: Schema.NumberFromString.pipe(
		Schema.int(),
		Schema.positive(),
		Schema.propertySignature,
		Schema.withConstructorDefault(() => 30),
	),
	sorting: Schema.parseJson(SortingStateSchema).pipe(Schema.optional),
};

export const PagedListResponse = <S extends Schema.Schema<any, any, any>>(
	item: S,
) =>
	Schema.Struct({
		items: Schema.Array(item),
		totalPages: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
	});
