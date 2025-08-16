import { Schema } from "effect";
import { WorkspaceApiClient, route } from "../httpClient";
import {
	CreateIntegrationRequestSchema,
	EditIntegrationRequestSchema,
	GetIntegrationResponseSchema,
	ListIntegrationsResponseSchema,
	type GetIntegrationResponse,
} from "../models/integrations";

export const listIntegrations = route({
	method: "get",
	url: "/api/v1/integrations",
	client: WorkspaceApiClient,
	responseSchema: ListIntegrationsResponseSchema,
});

export const createIntegration = route({
	method: "post",
	url: "/api/v1/integrations",
	client: WorkspaceApiClient,
	requestSchema: CreateIntegrationRequestSchema,
	responseSchema: GetIntegrationResponseSchema,
});

export const editIntegration = route({
	method: "patch",
	url: "/api/v1/integrations",
	client: WorkspaceApiClient,
	requestSchema: EditIntegrationRequestSchema,
	responseSchema: GetIntegrationResponseSchema,
});

export const deleteIntegration = route({
	method: "del",
	url: (type: GetIntegrationResponse["data"]["_tag"]) =>
		`/api/v1/integrations/${type}`,
	client: WorkspaceApiClient,
});

export const listAvailablePaymentMethods = route({
	method: "get",
	url: "/api/v1/available-payment-methods",
	client: WorkspaceApiClient,
	responseSchema: Schema.Array(Schema.NonEmptyString),
});
