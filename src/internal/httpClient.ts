import {
	HttpClient,
	HttpClientRequest,
	type HttpClientResponse,
} from "@effect/platform";
import { ResponseError } from "@effect/platform/HttpClientError";
import { Config, Effect, type Layer, Option, Schema, pipe } from "effect";
import type { GenerateExpandPaths } from "../expand";
/** @internal */
export const filterStatusOk = (
	self: HttpClientResponse.HttpClientResponse,
): Effect.Effect<HttpClientResponse.HttpClientResponse, ResponseError> =>
	self.status >= 200 && self.status < 300
		? Effect.succeed(self)
		: self.text.pipe(
				Effect.andThen(t =>
					Effect.fail(
						new ResponseError({
							response: self,
							request: self.request,
							reason: "StatusCode",
							description: "non 2xx status code",
							cause: t,
						}),
					),
				),
			);

/** @internal */
export const makeClientFilterStatusOk = <E, R>(
	self: HttpClient.HttpClient.With<E, R>,
): HttpClient.HttpClient.With<E | ResponseError, R> =>
	HttpClient.transformResponse(self, Effect.flatMap(filterStatusOk));

export const genericHttpClient = Effect.andThen(
	HttpClient.HttpClient,
	makeClientFilterStatusOk,
);

/** @internal */
export const unauthenticatedApiClientEffect = pipe(
	HttpClient.HttpClient,
	Effect.andThen(makeClientFilterStatusOk),
	Effect.andThen(
		HttpClient.mapRequestEffect(r =>
			Effect.gen(function* () {
				const apiUrl = yield* Config.string("VIPAGO_API_URL").pipe(
					Effect.catchAll(() =>
						Effect.gen(function* () {
							yield* Effect.logDebug("Assuming production API URL");
							return "https://api.vipago.com";
						}),
					),
				);
				return r.pipe(
					HttpClientRequest.prependUrl(apiUrl),
					HttpClientRequest.setHeaders({
						pragma: "no-cache",
						"cache-control": "no-cache",
					}),
				);
			}),
		),
	),
);

/** @internal */
export const authenticatedApiClientEffect = pipe(
	unauthenticatedApiClientEffect,
	Effect.andThen(
		HttpClient.mapRequestEffect(req =>
			Effect.gen(function* () {
				const apiKey = yield* Config.string("VIPAGO_API_KEY").pipe(
					Effect.option,
				);
				if (Option.isNone(apiKey)) return req;
				return HttpClientRequest.setHeader(
					"Authorization",
					`Bearer ${apiKey.value}`,
				)(req);
			}),
		),
	),
);

/** @internal */
export const workspaceApiClientEffect = pipe(
	authenticatedApiClientEffect,
	Effect.andThen(
		HttpClient.mapRequestEffect(req =>
			Effect.gen(function* () {
				const useWorkspaceId = yield* Config.string(
					"VIPAGO_USE_WORKSPACE",
				).pipe(Effect.option);
				if (Option.isNone(useWorkspaceId)) return req;
				return HttpClientRequest.setHeader(
					"X-Use-Workspace",
					useWorkspaceId.value,
				)(req);
			}),
		),
	),
);

/** @internal */
export const routeWithoutResponse =
	<T>(
		method: "post" | "get" | "del" | "patch" | "put",
		url: string,
		client: Layer.Layer<HttpClient.HttpClient>,
		name = `${method} ${url}`,
		requestSchema?: Schema.Schema<T, any, never>,
	) =>
	(body?: T) =>
		Effect.gen(function* () {
			let actualBody = body;
			if (requestSchema && body !== undefined) {
				actualBody = yield* Schema.encode(requestSchema)(body);
			}
			return yield* HttpClientRequest[method](url).pipe(
				method !== "get" && actualBody !== undefined
					? HttpClientRequest.bodyJson(actualBody)
					: r => Effect.succeed(r),
				Effect.orDie,
				Effect.flatMap((yield* HttpClient.HttpClient).execute),
				Effect.asVoid,
				Effect.withSpanScoped(name),
			);
		}).pipe(Effect.scoped, Effect.provide(client));

/** @internal */
export const routeWithResponse =
	<Req, ResType>(
		method: "post" | "get" | "del" | "patch" | "put",
		url: string,
		client: Layer.Layer<HttpClient.HttpClient>,
		unexpandedResponseSchema: Schema.Schema<ResType, any, never>,
		name = `${method} ${url}`,
		requestSchema?: Schema.Schema<Req, any, never>,
	) =>
	<Expand extends GenerateExpandPaths<ResType>[] = []>(
		body?: Req,
		expand?: Expand,
	) =>
		Effect.gen(function* () {
			let actualBody = body;
			if (requestSchema && body !== undefined) {
				actualBody = yield* Schema.encode(requestSchema)(body);
			}

			let actualUrl = url;
			if (method === "get" && actualBody) {
				const queryParams = new URLSearchParams();
				for (const [key, value] of Object.entries(
					actualBody as Record<string, unknown>,
				)) {
					if (value !== undefined && value !== null) {
						queryParams.append(key, String(value));
					}
				}
				const queryString = queryParams.toString();
				if (queryString) {
					const separator = url.includes("?") ? "&" : "?";
					actualUrl = `${url}${separator}${queryString}`;
				}
			}

			return yield* HttpClientRequest[method](actualUrl).pipe(
				expand
					? HttpClientRequest.setHeader("Expand", expand.join(","))
					: r => r,
				method !== "get" && actualBody !== undefined
					? HttpClientRequest.bodyJson(actualBody)
					: r => Effect.succeed(r),
				Effect.orDie,
				Effect.flatMap((yield* HttpClient.HttpClient).execute),
				Effect.andThen(res => res.json),
				Effect.andThen(res =>
					Effect.gen(function* () {
						const { expandSchema } = yield* Effect.promise(
							() => import("../expand"),
						);
						return { expandSchema, res };
					}),
				),
				Effect.andThen(({ res, expandSchema }) =>
					Schema.decodeUnknown(
						expandSchema(unexpandedResponseSchema, expand ?? ([] as const)),
					)(res),
				),
				Effect.withSpanScoped(name),
			);
		}).pipe(Effect.scoped, Effect.provide(client));

/** @internal */
export const routeGet =
	<ResType>(
		url: string,
		client: Layer.Layer<HttpClient.HttpClient>,
		unexpandedResponseSchema: Schema.Schema<ResType, any, never>,
		name = `GET ${url}`,
	) =>
	<Expand extends GenerateExpandPaths<ResType>[] = []>(expand?: Expand) =>
		routeWithResponse<never, ResType>(
			"get",
			url,
			client,
			unexpandedResponseSchema,
			name,
		)(undefined, expand);

/** @internal */
export const routeGetWithParam =
	<ResType, Param = string>(
		url: (r: Param) => string,
		client: Layer.Layer<HttpClient.HttpClient>,
		unexpandedResponseSchema: Schema.Schema<ResType, any, never>,
		name = `GET ${url}`,
	) =>
	<Expand extends GenerateExpandPaths<ResType>[] = []>(
		r: Param,
		expand?: Expand,
	) =>
		routeWithResponse<never, ResType>(
			"get",
			url(r),
			client,
			unexpandedResponseSchema,
			name,
		)(undefined, expand);

/** @internal */
export const routeWithResponseAndParam =
	<Req, ResType, Param = string>(
		method: "post" | "get" | "del" | "patch" | "put",
		url: (r: Param) => string,
		client: Layer.Layer<HttpClient.HttpClient>,
		unexpandedResponseSchema: Schema.Schema<ResType, any, never>,
		name = `${method} ${url}`,
		requestSchema?: Schema.Schema<Req, any, never>,
	) =>
	<Expand extends GenerateExpandPaths<ResType>[] = []>(
		r: Param,
		body?: Req,
		expand?: Expand,
	) =>
		routeWithResponse<Req, ResType>(
			method,
			url(r),
			client,
			unexpandedResponseSchema,
			name,
			requestSchema,
		)(body, expand);

/** @internal */
export const routeWithoutResponseWithParam =
	<T, Param = string>(
		method: "post" | "get" | "del" | "patch" | "put",
		url: (r: Param) => string,
		client: Layer.Layer<HttpClient.HttpClient>,
		name = `${method} ${url}`,
		requestSchema?: Schema.Schema<T, any, never>,
	) =>
	(r: Param, body?: T) =>
		routeWithoutResponse<T>(method, url(r), client, name, requestSchema)(body);
