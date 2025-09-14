import { Schema } from "effect";
import { idSchema } from "../idGenerator";
import { DateMaybeFromString } from "./DateMaybeFromString";
import { Email } from "./emailValidator";
import { SortingStateSchema } from "./sorting";
import { ExpandableWorkspaceId } from "./workspace";
export const CustomerId = idSchema("cust", "cliente");
export const GetCustomerResponseSchema = Schema.Struct({
	id: CustomerId,
	name: Schema.NonEmptyString,
	email: Email,
	phone: Schema.NonEmptyString.pipe(Schema.optionalWith({ nullable: true })),
	workspaceId: ExpandableWorkspaceId,
	externalId: Schema.NonEmptyString.pipe(
		Schema.optionalWith({ nullable: true }),
	),
	createdAt: DateMaybeFromString,
	updatedAt: DateMaybeFromString,
}).annotations({
	title: "Customer",
});
export const ExpandableCustomerId = Schema.Union(
	CustomerId,
	GetCustomerResponseSchema,
);

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
