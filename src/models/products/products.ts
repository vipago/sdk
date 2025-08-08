import { Schema } from "effect";
import { idSchema } from "../../idGenerator";
import { GetWorkspaceResponseSchema } from "../workspace";

export const GetProductResponseSchema = Schema.Struct({
	id: idSchema("prod", "Produto"),
	name: Schema.NonEmptyString,
	iconUrl: Schema.NonEmptyString.pipe(Schema.NullOr),
	workspaceId: Schema.Union(
		idSchema("wosp", "Workspace"),
		GetWorkspaceResponseSchema,
	),
	active: Schema.Boolean,
});

export type GetProductResponse = typeof GetProductResponseSchema.Type;

export const ListProductsResponseSchema = Schema.Struct({
	items: GetProductResponseSchema.pipe(Schema.Array),
	totalPages: Schema.Number,
});

export type ListProductsResponse = typeof ListProductsResponseSchema.Type;
export const ListProductsRequestSchema = Schema.Struct({
	page: Schema.Number.pipe(
		Schema.propertySignature,
		Schema.withConstructorDefault(() => 0),
	),
	itemsPerPage: Schema.Number.pipe(
		Schema.propertySignature,
		Schema.withConstructorDefault(() => 30),
	),
});
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
