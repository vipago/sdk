import { Schema } from "effect";
import { ProductId } from "../ids";
import { LargeListOptions } from "../listOptions";
import { ExpandableWorkspaceId } from "../workspace";
export const GetProductResponseSchema = Schema.Struct({
	id: ProductId,
	name: Schema.NonEmptyString,
	iconUrl: Schema.NonEmptyString.pipe(Schema.NullOr),
	workspaceId: ExpandableWorkspaceId,
	active: Schema.Boolean,
});
export const ExpandableProductId = Schema.Union(
	ProductId,
	GetProductResponseSchema,
);
export type GetProductResponse = typeof GetProductResponseSchema.Type;

export const ListProductsResponseSchema = Schema.Struct({
	items: GetProductResponseSchema.pipe(Schema.Array),
	totalPages: Schema.Number,
});

export type ListProductsResponse = typeof ListProductsResponseSchema.Type;
export const ListProductsRequestSchema = Schema.Struct(LargeListOptions);
export type ListProductsRequest = typeof ListProductsRequestSchema.Type;
export const CreateProductRequestSchema = Schema.Struct({
	name: Schema.NonEmptyString,
	iconUrl: Schema.NonEmptyString.pipe(
		Schema.NullOr,
		Schema.propertySignature,
		Schema.withConstructorDefault(() => null),
	),
});
export type CreateProductRequest = typeof CreateProductRequestSchema.Type;

export const EditProductRequestSchema = Schema.Struct({
	name: Schema.NonEmptyString.pipe(Schema.optional),
	iconUrl: Schema.NonEmptyString.pipe(Schema.NullOr, Schema.optional),
	active: Schema.optional(Schema.Boolean),
});
export type EditProductRequest = typeof EditProductRequestSchema.Type;
