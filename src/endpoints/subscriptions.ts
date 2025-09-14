import { Schema } from "effect";
import { WorkspaceApiClient, route } from "../httpClient";
import {
	EditSubscriptionRequestSchema,
	GetSubscriptionResponseSchema,
	ListSubscriptionQuerySchema,
	RequestPlanChangeRequestSchema,
	RequestPlanChangeResponseSchema,
} from "../models/subscriptions";

export const listSubscriptions = route({
	method: "get",
	url: "/api/v1/subscriptions",
	client: WorkspaceApiClient,
	allowBody: true,
	requestSchema: ListSubscriptionQuerySchema,
	responseSchema: Schema.Array(GetSubscriptionResponseSchema),
});

export const getSubscription = route({
	method: "get",
	url: (id: (typeof GetSubscriptionResponseSchema.Type)["id"]) =>
		"/api/v1/subscriptions/" + encodeURIComponent(id),
	client: WorkspaceApiClient,
	allowBody: true,
	requestSchema: ListSubscriptionQuerySchema,
	responseSchema: GetSubscriptionResponseSchema,
});

export const editSubscription = route({
	method: "patch",
	url: (id: (typeof GetSubscriptionResponseSchema.Type)["id"]) =>
		"/api/v1/subscriptions/" + encodeURIComponent(id),
	client: WorkspaceApiClient,
	requestSchema: EditSubscriptionRequestSchema,
	responseSchema: GetSubscriptionResponseSchema,
});
export const requestSubscriptionPlanChange = route({
	method: "patch",
	url: (id: (typeof GetSubscriptionResponseSchema.Type)["id"]) =>
		"/api/v1/subscriptions/" + encodeURIComponent(id) + "/plan",
	client: WorkspaceApiClient,
	requestSchema: RequestPlanChangeRequestSchema,
	responseSchema: RequestPlanChangeResponseSchema,
});
