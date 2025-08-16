import { WorkspaceApiClient, route } from "../httpClient";
import { WorkspaceGatewayPreferencesSchema } from "../models/workspaceGatewayPreferences";

export const getGatewayPreferences = route({
	client: WorkspaceApiClient,
	method: "get",
	url: (paymentMethodName: string) =>
		`/api/v1/settings/gateway-preferences/${paymentMethodName}`,
	responseSchema: WorkspaceGatewayPreferencesSchema,
	name: "getGatewayPreferences",
});
export const setGatewayPreferences = route({
	client: WorkspaceApiClient,
	method: "put",
	url: (paymentMethodName: string) =>
		`/api/v1/settings/gateway-preferences/${paymentMethodName}`,
	requestSchema: WorkspaceGatewayPreferencesSchema,
	name: "setGatewayPreferences",
});
