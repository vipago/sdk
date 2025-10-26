import { WorkspaceApiClient, route } from "../httpClient";
import { WebhookDeliveryId, WebhookId } from "../models/ids";
import {
	CreateWorkspaceWebhookRequestSchema,
	GetWorkspaceWebhookResponseSchema,
	ListWebhookDeliveriesQuerySchema,
	ListWebhookDeliveriesResponseSchema,
	ListWorkspaceWebhooksQuerySchema,
	ListWorkspaceWebhooksResponseSchema,
	UpdateWorkspaceWebhookRequestSchema,
	WebhookDeliverySchema,
} from "../models/webhooks";

export const listWorkspaceWebhooks = route({
	method: "get",
	url: "/api/v1/webhooks",
	client: WorkspaceApiClient,
	allowBody: true,
	requestSchema: ListWorkspaceWebhooksQuerySchema,
	responseSchema: ListWorkspaceWebhooksResponseSchema,
});

export const createWorkspaceWebhook = route({
	method: "post",
	url: "/api/v1/webhooks",
	client: WorkspaceApiClient,
	requestSchema: CreateWorkspaceWebhookRequestSchema,
	responseSchema: GetWorkspaceWebhookResponseSchema,
});

export const getWorkspaceWebhook = route({
	method: "get",
	url: (webhookId: typeof WebhookId.Type) => `/api/v1/webhooks/${encodeURIComponent(webhookId)}`,
	client: WorkspaceApiClient,
	responseSchema: GetWorkspaceWebhookResponseSchema,
});

export const updateWorkspaceWebhook = route({
	method: "patch",
	url: (webhookId: typeof WebhookId.Type) => `/api/v1/webhooks/${encodeURIComponent(webhookId)}`,
	client: WorkspaceApiClient,
	requestSchema: UpdateWorkspaceWebhookRequestSchema,
	responseSchema: GetWorkspaceWebhookResponseSchema,
});

export const deleteWorkspaceWebhook = route({
	method: "del",
	url: (webhookId: typeof WebhookId.Type) => `/api/v1/webhooks/${encodeURIComponent(webhookId)}`,
	client: WorkspaceApiClient,
});

export const listWebhookDeliveries = route({
	method: "get",
	url: "/api/v1/webhooks/deliveries",
	client: WorkspaceApiClient,
	allowBody: true,
	requestSchema: ListWebhookDeliveriesQuerySchema,
	responseSchema: ListWebhookDeliveriesResponseSchema,
});

export const getWebhookDelivery = route({
	method: "get",
	url: (deliveryId: typeof WebhookDeliveryId.Type) => `/api/v1/webhooks/deliveries/${encodeURIComponent(deliveryId)}`,
	client: WorkspaceApiClient,
	responseSchema: WebhookDeliverySchema,
});

export const retryWebhookDelivery = route({
	method: "post",
	url: (deliveryId: typeof WebhookDeliveryId.Type) => `/api/v1/webhooks/deliveries/${encodeURIComponent(deliveryId)}/retry`,
	client: WorkspaceApiClient,
	responseSchema: WebhookDeliverySchema,
});
