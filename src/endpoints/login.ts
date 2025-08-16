import { UnauthenticatedApiClient, route } from "../httpClient";
import {
	PasswordLoginRequestSchema,
	PasswordLoginResponseSchema,
} from "../models/session";

export const login = route({
	method: "post",
	url: "/api/v1/session",
	client: UnauthenticatedApiClient,
	requestSchema: PasswordLoginRequestSchema,
	responseSchema: PasswordLoginResponseSchema,
	name: "login request",
});
