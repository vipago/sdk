import { Schema } from "effect";
import { UserFeatures } from "../features";
import { AuthenticatedApiClient, route } from "../httpClient";
import {
	GetIntegrationResponseSchema,
	ListIntegrationsResponseSchema,
} from "../models/integrations";
import { GetUserResponseSchema } from "../models/user";

export const approveIntegration = route({
	method: "post",
	url: (integrationId: string) =>
		`/api/v1/integrations/${integrationId}/admin_approve`,
	client: AuthenticatedApiClient,
	responseSchema: GetIntegrationResponseSchema,
});

export const rejectIntegration = route({
	method: "post",
	url: (integrationId: string) =>
		`/api/v1/integrations/${integrationId}/admin_reject`,
	client: AuthenticatedApiClient,
	responseSchema: GetIntegrationResponseSchema,
});

export const listPendingIntegrations = route({
	method: "get",
	url: "/api/v1/integrations/admin_pending",
	client: AuthenticatedApiClient,
	responseSchema: ListIntegrationsResponseSchema,
});

const SearchUsersResponseSchema = Schema.Struct({
	items: Schema.Array(GetUserResponseSchema),
	totalPages: Schema.Number,
});

export const searchUsers = route({
	method: "get",
	url: (query: string) =>
		`/api/v1/users/admin_search?q=${encodeURIComponent(query)}`,
	client: AuthenticatedApiClient,
	responseSchema: SearchUsersResponseSchema,
});

const UpdateUserFeaturesRequestSchema = Schema.Struct({
	features: Schema.NonEmptyArray(UserFeatures.VALIDATOR),
});

export const updateUserFeatures = route({
	method: "patch",
	url: (userId: string) => `/api/v1/users/admin_update/${userId}/features`,
	client: AuthenticatedApiClient,
	requestSchema: UpdateUserFeaturesRequestSchema,
	responseSchema: GetUserResponseSchema,
});
