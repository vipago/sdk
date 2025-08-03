import { WorkspaceApiClient, route } from "../httpClient";
import {
	type WorkspaceGatewayPreferences,
	WorkspaceGatewayPreferencesSchema,
} from "../models/workspaceGatewayPreferences";

export const getGatewayPreferences = route({
	client: WorkspaceApiClient,
	method: "get",
	url: (paymentMethodName: string) =>
		`/api/v1/settings/gateway-preferences/${paymentMethodName}`,
	responseSchema: WorkspaceGatewayPreferencesSchema,
	name: "getGatewayPreferences",
});
export const setGatewayPreferences = route<WorkspaceGatewayPreferences>({
	client: WorkspaceApiClient,
	method: "put",
	url: (paymentMethodName: string) =>
		`/api/v1/settings/gateway-preferences/${paymentMethodName}`,
	name: "setGatewayPreferences",
});
