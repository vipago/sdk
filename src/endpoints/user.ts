import {
	AuthenticatedApiClient,
	UnauthenticatedApiClient,
	route,
} from "../httpClient";
import {
	GetUserByEmailResponseSchema,
	GetUserResponseSchema,
} from "../models/user";

export const getUser = route({
	method: "get",
	url: "/api/v1/users/self",
	client: AuthenticatedApiClient,
	responseSchema: GetUserResponseSchema,
});

export const getUserByEmail = route({
	method: "get",
	url: email => `/api/v1/users/by-email/${encodeURIComponent(email)}`,
	client: UnauthenticatedApiClient,
	responseSchema: GetUserByEmailResponseSchema,
});
