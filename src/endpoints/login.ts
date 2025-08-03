import { UnauthenticatedApiClient, route } from "../httpClient";
import {
	type PasswordLoginRequest,
	type PasswordLoginResponse,
	PasswordLoginResponseSchema,
} from "../models/session";

export const login = route<PasswordLoginRequest, PasswordLoginResponse>({
	method: "post",
	url: "/api/v1/session",
	client: UnauthenticatedApiClient,
	responseSchema: PasswordLoginResponseSchema,
	name: "login request",
});
