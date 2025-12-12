import { AuthenticatedApiClient, route } from "../httpClient";
import {
	GetIntegrationResponseSchema,
	ListIntegrationsResponseSchema,
} from "../models/integrations";

export const approveIntegration = route({
	method: "post",
	url: (integrationId: string) =>
		`/api/v1/integrations/${integrationId}/admin_approve`,
	client: AuthenticatedApiClient,
	responseSchema: GetIntegrationResponseSchema,
});

export const listPendingIntegrations = route({
	method: "get",
	url: "/api/v1/integrations/admin_pending",
	client: AuthenticatedApiClient,
	responseSchema: ListIntegrationsResponseSchema,
});
