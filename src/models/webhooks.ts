import { Schema } from "effect";
import { DateMaybeFromString } from "./DateMaybeFromString";
import { WebhookDeliveryId, WebhookId, WorkspaceId } from "./ids";
import { LargeListOptions, PagedListResponse } from "./listOptions";
import { GetWorkspaceResponseSchema } from "./workspace";

export const WebhookResourceTypeSchema = Schema.Literal("invoice", "subscription");
export type WebhookResourceType = typeof WebhookResourceTypeSchema.Type;

export const WebhookDeliveryStatusSchema = Schema.Literal("pending", "succeeded", "failed");
export type WebhookDeliveryStatus = typeof WebhookDeliveryStatusSchema.Type;

export const HeadersRecordSchema = Schema.partial(Schema.Record({
	key: Schema.String,
	value: Schema.String,
}));

const JsonRecordSchema = Schema.partial(Schema.Record({
	key: Schema.String,
	value: Schema.Unknown,
}));

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
	description: Schema.String.pipe(Schema.optional),
	isEnabled: Schema.Boolean.pipe(Schema.optional),
	customHeaders: HeadersRecordSchema.pipe(Schema.optional),
	subscribedResources: Schema.Array(WebhookResourceTypeSchema).pipe(Schema.optional),
});
export type CreateWorkspaceWebhookRequest = typeof CreateWorkspaceWebhookRequestSchema.Type;

export const UpdateWorkspaceWebhookRequestSchema = Schema.Struct({
	name: Schema.NonEmptyString.pipe(Schema.optional),
	url: Schema.String.pipe(Schema.optional),
	description: Schema.String.pipe(Schema.optional),
	isEnabled: Schema.Boolean.pipe(Schema.optional),
	customHeaders: HeadersRecordSchema.pipe(Schema.optional),
	subscribedResources: Schema.Array(WebhookResourceTypeSchema).pipe(Schema.optional),
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
	responseStatusCode: Schema.Number.pipe(Schema.optional),
	responseHeaders: HeadersRecordSchema.pipe(Schema.optional),
	responseBody: Schema.String.pipe(Schema.optional),
	errorType: Schema.NullOr(Schema.String).pipe(Schema.optional),
	errorMessage: Schema.NullOr(Schema.String).pipe(Schema.optional),
	durationMs: Schema.Number.pipe(Schema.optional),
	nextRetryAt: DateMaybeFromString.pipe(Schema.optional),
	sentAt: DateMaybeFromString.pipe(Schema.optional),
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
