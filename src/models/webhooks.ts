import { Schema } from "effect";
import { DateMaybeFromString } from "./DateMaybeFromString";
import { WebhookDeliveryId, WebhookId, WorkspaceId } from "./ids";
import { LargeListOptions, PagedListResponse } from "./listOptions";
import { GetWorkspaceResponseSchema } from "./workspace";

export const WebhookResourceTypeSchema = Schema.Literal("invoice", "subscription");
export type WebhookResourceType = typeof WebhookResourceTypeSchema.Type;

export const WebhookDeliveryStatusSchema = Schema.Literal("pending", "succeeded", "failed");
export type WebhookDeliveryStatus = typeof WebhookDeliveryStatusSchema.Type;

export const HeadersRecordSchema = Schema.partial(
	Schema.Record({
		key: Schema.String,
		value: Schema.String,
	}),
);

const JsonRecordSchema = Schema.partial(
	Schema.Record({
		key: Schema.String,
		value: Schema.Unknown,
	}),
);

export const CustomHeadersSchema = HeadersRecordSchema.pipe(Schema.optionalWith({ default: () => ({}) }));

export const ExpandableWebhookWorkspaceId = Schema.Union(WorkspaceId, GetWorkspaceResponseSchema);

export const GetWorkspaceWebhookResponseSchema = Schema.Struct({
	id: WebhookId,
	workspaceId: ExpandableWebhookWorkspaceId,
	name: Schema.NonEmptyString,
	url: Schema.String,
	description: Schema.String.pipe(Schema.NullOr),
	isEnabled: Schema.Boolean,
	signingSecret: Schema.String,
	customHeaders: HeadersRecordSchema.pipe(Schema.optionalWith({ default: () => ({}) })),
	subscribedResources: Schema.Array(WebhookResourceTypeSchema),
	lastSentAt: DateMaybeFromString.pipe(Schema.NullOr),
	createdAt: DateMaybeFromString,
	updatedAt: DateMaybeFromString,
}).annotations({
	title: "Workspace Webhook",
	description: "Webhook configuration stored at the workspace level",
});
export type GetWorkspaceWebhookResponse = typeof GetWorkspaceWebhookResponseSchema.Type;

export const CreateWorkspaceWebhookRequestSchema = Schema.Struct({
	name: Schema.NonEmptyString,
	url: Schema.String,
	description: Schema.String.pipe(Schema.optionalWith({ nullable: true })),
	isEnabled: Schema.Boolean.pipe(Schema.optionalWith({ nullable: true })),
	customHeaders: HeadersRecordSchema.pipe(Schema.optionalWith({ nullable: true })),
	subscribedResources: Schema.Array(WebhookResourceTypeSchema).pipe(Schema.optionalWith({ nullable: true })),
});
export type CreateWorkspaceWebhookRequest = typeof CreateWorkspaceWebhookRequestSchema.Type;

export const UpdateWorkspaceWebhookRequestSchema = Schema.Struct({
	name: Schema.NonEmptyString.pipe(Schema.optionalWith({ nullable: true })),
	url: Schema.String.pipe(Schema.optionalWith({ nullable: true })),
	description: Schema.String.pipe(Schema.optionalWith({ nullable: true })),
	isEnabled: Schema.Boolean.pipe(Schema.optionalWith({ nullable: true })),
	customHeaders: HeadersRecordSchema.pipe(Schema.optionalWith({ nullable: true })),
	subscribedResources: Schema.Array(WebhookResourceTypeSchema).pipe(Schema.optionalWith({ nullable: true })),
}).annotations({
	title: "Edit Workspace Webhook",
});
export type UpdateWorkspaceWebhookRequest = typeof UpdateWorkspaceWebhookRequestSchema.Type;

export const ListWorkspaceWebhooksQuerySchema = Schema.Struct({
	...LargeListOptions,
}).pipe(Schema.partial);
export type ListWorkspaceWebhooksQuery = typeof ListWorkspaceWebhooksQuerySchema.Type;

export const ListWorkspaceWebhooksResponseSchema = PagedListResponse(GetWorkspaceWebhookResponseSchema);
export type ListWorkspaceWebhooksResponse = typeof ListWorkspaceWebhooksResponseSchema.Type;

export const WebhookDeliverySchema = Schema.Struct({
	id: WebhookDeliveryId,
	webhookId: WebhookId,
	workspaceId: WorkspaceId,
	resourceType: WebhookResourceTypeSchema,
	resourceId: Schema.String,
	status: WebhookDeliveryStatusSchema,
	attempt: Schema.Number,
	requestBody: JsonRecordSchema,
	requestHeaders: HeadersRecordSchema,
	httpMethod: Schema.Literal("POST"),
	responseStatusCode: Schema.Number.pipe(Schema.optionalWith({ nullable: true })),
	responseHeaders: HeadersRecordSchema.pipe(Schema.optionalWith({ nullable: true })),
	responseBody: Schema.String.pipe(Schema.optionalWith({ nullable: true })),
	errorType: Schema.String.pipe(Schema.optionalWith({ nullable: true })),
	errorMessage: Schema.String.pipe(Schema.optionalWith({ nullable: true })),
	durationMs: Schema.Number.pipe(Schema.optionalWith({ nullable: true })),
	nextRetryAt: DateMaybeFromString.pipe(Schema.optionalWith({ nullable: true })),
	sentAt: DateMaybeFromString.pipe(Schema.optionalWith({ nullable: true })),
	createdAt: DateMaybeFromString,
	updatedAt: DateMaybeFromString,
}).annotations({
	title: "Webhook Delivery Event",
	description: "Represents the lifecycle of a webhook delivery attempt",
});
export type WebhookDelivery = typeof WebhookDeliverySchema.Type;

export const ListWebhookDeliveriesQuerySchema = Schema.Struct({
	...LargeListOptions,
	webhookId: WebhookId,
	status: WebhookDeliveryStatusSchema,
	resourceType: WebhookResourceTypeSchema,
}).pipe(Schema.partial);
export type ListWebhookDeliveriesQuery = typeof ListWebhookDeliveriesQuerySchema.Type;

export const ListWebhookDeliveriesResponseSchema = PagedListResponse(WebhookDeliverySchema);
export type ListWebhookDeliveriesResponse = typeof ListWebhookDeliveriesResponseSchema.Type;
