import {
	AuthenticatedApiClient,
	UnauthenticatedApiClient,
	route,
} from "../httpClient";
import {
	GetUserByEmailResponseSchema,
	type GetUserResponse,
	GetUserResponseSchema,
} from "../models/user";

export const getUser = route<GetUserResponse>({
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
