import { AuthenticatedApiClient, route } from "../httpClient";
import {
	GetIntegrationResponseSchema,
	ListIntegrationsResponseSchema,
} from "../models/integrations";

export const validateIntegration = route({
	method: "patch",
	url: (integrationId: string) =>
		`/api/v1/admin/integrations/${integrationId}/validate`,
	client: AuthenticatedApiClient,
	responseSchema: GetIntegrationResponseSchema,
});

export const listPendingIntegrations = route({
	method: "get",
	url: "/api/v1/admin/integrations/pending",
	client: AuthenticatedApiClient,
	responseSchema: ListIntegrationsResponseSchema,
});
