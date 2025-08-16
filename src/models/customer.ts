import { Schema } from "effect";
import { idSchema } from "../idGenerator";
import { Email } from "./emailValidator";
import { SortingStateSchema } from "./sorting";
import { GetWorkspaceResponseSchema } from "./workspace";

export const GetCustomerResponseSchema = Schema.Struct({
	id: idSchema("cust", "customer"),
	name: Schema.NonEmptyString,
	email: Email,
	phone: Schema.NonEmptyString.pipe(Schema.optionalWith({ nullable: true })),
	workspaceId: Schema.Union(
		idSchema("wosp", "workspace"),
		GetWorkspaceResponseSchema,
	),
	externalId: Schema.NonEmptyString.pipe(
		Schema.optionalWith({ nullable: true }),
	),
	createdAt: Schema.DateFromString,
	updatedAt: Schema.DateFromString,
}).annotations({
	title: "Customer",
});

export type GetCustomerResponse = typeof GetCustomerResponseSchema.Type;
export const ListCustomersQuerySchema = Schema.Struct({
	page: Schema.NumberFromString.pipe(
		Schema.propertySignature,
		Schema.withConstructorDefault(() => 0),
	),
	itemsPerPage: Schema.NumberFromString.pipe(
		Schema.propertySignature,
		Schema.withConstructorDefault(() => 30),
	),
	email: Schema.NonEmptyString,
	name: Schema.NonEmptyString,
	sorting: Schema.parseJson(SortingStateSchema),
}).pipe(Schema.partial);
export type ListCustomersQuery = typeof ListCustomersQuerySchema.Type;
export const ListCustomersResponseSchema = Schema.Struct({
	items: GetCustomerResponseSchema.pipe(Schema.Array),
	totalPages: Schema.Number,
});

export type ListCustomersResponse = typeof ListCustomersResponseSchema.Type;

export const CreateCustomerRequestSchema = Schema.Struct({
	name: Schema.NonEmptyString,
	email: Email,
	phone: Schema.NonEmptyString.pipe(Schema.optional),
	externalId: Schema.NonEmptyString.pipe(Schema.optional),
});

export type CreateCustomerRequest = typeof CreateCustomerRequestSchema.Type;

export const EditCustomerRequestSchema = Schema.Struct({
	name: Schema.NonEmptyString.pipe(Schema.optional),
	email: Email.pipe(Schema.optional),
	phone: Schema.NonEmptyString.pipe(Schema.optional),
	externalId: Schema.NonEmptyString.pipe(Schema.optional),
});

export type EditCustomerRequest = typeof EditCustomerRequestSchema.Type;
