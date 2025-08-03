import { FetchHttpClient, HttpClient } from "@effect/platform";
import { Effect, Layer, type Schema } from "effect";
import * as internal from "./internal/httpClient";

export const UnauthenticatedApiClient = Layer.effect(
	HttpClient.HttpClient,
	internal.unauthenticatedApiClientEffect.pipe(
		Effect.provide(FetchHttpClient.layer),
	),
);

export const AuthenticatedApiClient = Layer.effect(
	HttpClient.HttpClient,
	internal.authenticatedApiClientEffect.pipe(
		Effect.provide(FetchHttpClient.layer),
	),
);

export const WorkspaceApiClient = Layer.effect(
	HttpClient.HttpClient,
	internal.workspaceApiClientEffect.pipe(Effect.provide(FetchHttpClient.layer)),
);
/**
 * Interface for the route function with overloads for different API endpoint patterns.
 */
export interface RouteFunction {
	/**
	 * Creates a route with a static URL and response schema for GET requests (without body)
	 * @example route<User>({ method: "get", url: "/api/users", responseSchema: UserSchema, client: AuthenticatedApiClient })
	 */
	<ResType>(options: {
		method: "get";
		url: string;
		client: Layer.Layer<HttpClient.HttpClient>;
		responseSchema: Schema.Schema<ResType, any, never>;
		name?: string;
		allowBody?: false | undefined;
	}): ReturnType<typeof internal.routeGet<ResType>>;

	/**
	 * Creates a route with a static URL and response schema for GET requests (with body)
	 * @example route<SomeKindOfOptions, User[]>({ method: "get", url: "/api/users", responseSchema: UserSchema, client: AuthenticatedApiClient, allowBody: true })
	 */
	<Req, ResType>(options: {
		method: "get";
		url: string;
		client: Layer.Layer<HttpClient.HttpClient>;
		responseSchema: Schema.Schema<ResType, any, never>;
		name?: string;
		allowBody: true;
	}): ReturnType<typeof internal.routeWithResponse<Req, ResType>>;
	/**
	 * Creates a route with a parameterized URL and response schema for GET requests (without body)
	 * @example route<User[]>({ method: "get", url: id => `/api/users/${id}`, responseSchema: UserSchema, client: AuthenticatedApiClient })
	 */
	<ResType, Param = string>(options: {
		method: "get";
		url: (params: Param) => string;
		client: Layer.Layer<HttpClient.HttpClient>;
		responseSchema: Schema.Schema<ResType, any, never>;
		name?: string;
		allowBody?: false | undefined;
	}): ReturnType<typeof internal.routeGetWithParam<ResType, Param>>;

	/**
	 * Creates a route with a parameterized URL and response schema for GET requests (with body)
	 * @example route<RequestBody, User[], string>({ method: "get", url: id => `/api/users/${id}`, responseSchema: UserSchema, client: AuthenticatedApiClient, allowBody: true })
	 */
	<Req, ResType, Param = string>(options: {
		method: "get";
		url: (params: Param) => string;
		client: Layer.Layer<HttpClient.HttpClient>;
		responseSchema: Schema.Schema<ResType, any, never>;
		name?: string;
		allowBody: true;
	}): ReturnType<
		typeof internal.routeWithResponseAndParam<Req, ResType, Param>
	>;

	/**
	 * Creates a route with a static URL and no response schema
	 * @example route({ method: "get", url: "/api/ping", client: UnauthenticatedApiClient })
	 */
	<Req = never>(options: {
		method: "post" | "get" | "del" | "patch" | "put";
		url: string;
		client: Layer.Layer<HttpClient.HttpClient>;
		responseSchema?: undefined;
		name?: string;
		allowBody?: undefined;
	}): ReturnType<typeof internal.routeWithoutResponse<Req>>;

	/**
	 * Creates a route with a static URL and response schema for non-GET requests
	 * @example route<NewUser, User>({ method: "post", url: "/api/users", responseSchema: UserSchema, client: AuthenticatedApiClient })
	 */
	<Req, ResType>(options: {
		method: "post" | "put" | "patch" | "del" | "get";
		url: string;
		client: Layer.Layer<HttpClient.HttpClient>;
		responseSchema: Schema.Schema<ResType, any, never>;
		name?: string;
		allowBody?: undefined;
	}): ReturnType<typeof internal.routeWithResponse<Req, ResType>>;

	/**
	 * Creates a route with a parameterized URL and no response schema
	 * @example route<never, void, string>({ method: "del", url: id => `/api/users/${id}`, client: AuthenticatedApiClient })
	 */
	<Req = never, Param = string>(options: {
		method: "post" | "get" | "del" | "patch" | "put";
		url: (param: Param) => string;
		client: Layer.Layer<HttpClient.HttpClient>;
		responseSchema?: undefined;
		name?: string;
		allowBody?: undefined;
	}): ReturnType<typeof internal.routeWithoutResponseWithParam<Req, Param>>;

	/**
	 * Creates a route with a parameterized URL and response schema
	 * @example route<never, User, string>({ method: "get", url: id => `/api/users/${id}`, responseSchema: UserSchema, client: AuthenticatedApiClient })
	 */
	<Req = never, ResType = void, Param = string>(options: {
		method: "post" | "get" | "del" | "patch" | "put";
		url: (param: Param) => string;
		client: Layer.Layer<HttpClient.HttpClient>;
		responseSchema: Schema.Schema<ResType, any, never>;
		name?: string;
		allowBody?: undefined;
	}): ReturnType<
		typeof internal.routeWithResponseAndParam<Req, ResType, Param>
	>;
}

/**
 * Creates API route functions with type-safe request and response handling.
 *
 * This function serves as the primary way to define API endpoints in your application.
 * It handles different HTTP methods, URL patterns, request bodies, and response schemas.
 *
 * @see {@link RouteFunction} for the full list of overloads and examples
 */
export const route: RouteFunction = function route(
	options: Parameters<RouteFunction>[0],
) {
	const {
		method,
		url,
		client,
		responseSchema,
		allowBody = false,
		name = typeof url === "string" ? `${method} ${url}` : `${method}`,
	} = options;
	// Static URL with no response schema
	if (typeof url === "string" && responseSchema === undefined) {
		return internal.routeWithoutResponse(method, url, client, name);
	}
	// GET with static URL and response schema (no body)
	if (
		method === "get" &&
		typeof url === "string" &&
		responseSchema !== undefined &&
		!allowBody
	) {
		return internal.routeGet(url, client, responseSchema, name);
	}
	// GET with parameterized URL and response schema (no body)
	if (
		method === "get" &&
		typeof url === "function" &&
		responseSchema !== undefined &&
		!allowBody
	) {
		return internal.routeGetWithParam(url, client, responseSchema, name);
	}
	// GET with static URL and response schema (with body)
	if (
		method === "get" &&
		typeof url === "string" &&
		responseSchema !== undefined &&
		allowBody
	) {
		return internal.routeWithResponse(
			method,
			url,
			client,
			responseSchema,
			name,
		);
	}
	// GET with parameterized URL and response schema (with body)
	if (
		method === "get" &&
		typeof url === "function" &&
		responseSchema !== undefined &&
		allowBody
	) {
		return internal.routeWithResponseAndParam(
			method,
			url,
			client,
			responseSchema,
			name,
		);
	}
	// Static URL with response schema (non-GET or GET with body)
	if (typeof url === "string" && responseSchema !== undefined) {
		return internal.routeWithResponse(
			method,
			url,
			client,
			responseSchema,
			name,
		);
	}
	// Parameterized URL with no response schema
	if (typeof url === "function" && responseSchema === undefined) {
		return internal.routeWithoutResponseWithParam(method, url, client, name);
	}
	// Parameterized URL with response schema
	if (typeof url === "function" && responseSchema !== undefined) {
		return internal.routeWithResponseAndParam(
			method,
			url,
			client,
			responseSchema,
			name,
		);
	}
	// Fallback case
	throw new Error(`Invalid route configuration: ${name}`);
} as unknown as RouteFunction;
