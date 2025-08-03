import type { HttpClientError } from "@effect/platform";
import { Console, Data, Effect, Schema } from "effect";
import { ParseError } from "effect/ParseResult";

export const APIErrorResponseSchema = Schema.Struct({
	message: Schema.String,
	code: Schema.String,
	error: Schema.optional(Schema.Unknown),
});

export type APIErrorResponse = typeof APIErrorResponseSchema.Type;
export class ApiError extends Data.TaggedError("ApiError") {
	constructor(
		public readonly statusCode: number,
		public readonly apiError?: APIErrorResponse,
	) {
		super();
	}
	get message(): string {
		return this.apiError?.message || "No message available";
	}
	get code(): string {
		return this.apiError?.code || "ApiError";
	}
}
export class NetworkError extends Data.TaggedError("NetworkError") {}
/**
 * Handles errors for an Effect that may return an `HttpClientError`.
 *
 * This function takes an Effect and catches `ResponseError` and `RequestError` from `HttpClientError`.
 *
 * - For `ResponseError`, it attempts to parse the error response body into an `APIErrorResponse` using the provided schema.
 *   - If parsing is successful, it returns an `ApiError` containing the parsed error response.
 *   - If parsing fails, it returns a empty `ApiError`.
 * - For `RequestError`, it directly returns a `NetworkError`.
 *
 * @param expectedErrorCodes An array of error codes that should not be reported to Sentry.
 * @returns A new Effect that handles `HttpClientError` by returning either an `ApiError`, `NetworkError` or `ParseError`
 */
export const getRequestErrorDetails =
	(expectedErrorCodes: string[]) =>
	<A, E, R>(
		self: Effect.Effect<A, E | HttpClientError.HttpClientError, R>,
	): Effect.Effect<A, E | ApiError | NetworkError | ParseError, R> =>
		self.pipe(
			Effect.catchTag("ResponseError", eUncasted => {
				const e = eUncasted as HttpClientError.ResponseError;
				return e.response.json.pipe(
					Effect.andThen(Schema.decodeUnknown(APIErrorResponseSchema)),
					Effect.map(err => new ApiError(e.response.status, err)),
					Effect.catchTag("ResponseError", e =>
						Effect.fail(
							e.reason === "Decode"
								? new ApiError(e.response.status)
								: new NetworkError(),
						),
					),
					Effect.merge,
					Effect.tap(e =>
						Effect.gen(function* () {
							if (
								!(e instanceof ApiError) ||
								!e.apiError ||
								!expectedErrorCodes.includes(e.apiError.code) ||
								(e.statusCode >= 500 && e.statusCode <= 599)
							) {
								yield* Effect.logError(e);
							}
						}),
					),
					Effect.flip,
				);
			}),
			Effect.catchTag("RequestError", e => Effect.fail(new NetworkError())),
			Effect.withSpan("getRequestErrorDetails"),
		);
/**
 * Converts an `ApiError`, `NetworkError`, or `ParseError` into a user-friendly error message.
 *
 * @param error The error to convert.
 * @param errorMessages A record mapping error codes to user-friendly error messages.
 * @returns A user-friendly error message.
 */
export const getFriendlyErrorMessage = (
	error: unknown,
	errorMessages: Record<string, string>,
): string => {
	if (error instanceof ApiError && error.apiError) {
		const userMessage = errorMessages[error.apiError.code];
		if (userMessage) {
			return userMessage;
		}
		return `Erro de API: ${error.apiError.message}. O erro foi automaticamente reportado e iremos analisar em breve.`;
	}
	if (error instanceof NetworkError) {
		return "Erro de Rede: Por favor, verifique sua conexão com a internet e tente novamente.";
	}
	if (error instanceof ParseError) {
		return "Desculpe, algo deu errado ao entender a resposta do servidor. O erro foi automaticamente reportado e iremos analisar em breve.";
	}
	return "Ocorreu um erro desconhecido. O erro foi automaticamente reportado e iremos analisar em breve.";
};
/**
 * Wraps `getRequestErrorDetails` and `getFriendlyErrorMessage` into function.
 *
 * This is useful for when you're not interested in handling the errors in a specific way
 * and just want to display an error message to the user.
 *
 * @param errorMessagesMap A record mapping error codes to user-friendly error messages.
 * @returns A new Effect that handles `HttpClientError` and returns a user-friendly error message.
 */
export const handleApiError =
	(
		errorMessagesMap: Record<string, string>,
		getFriendlyErrorMessageFn: typeof getFriendlyErrorMessage = getFriendlyErrorMessage,
	) =>
	<A, E, R>(
		effect: Effect.Effect<A, E | HttpClientError.HttpClientError, R>,
	): Effect.Effect<A, string, R> =>
		effect.pipe(
			getRequestErrorDetails(Object.keys(errorMessagesMap)),
			Effect.tapError(Console.error),
			Effect.mapError(error =>
				getFriendlyErrorMessageFn(error, errorMessagesMap),
			),
			Effect.withSpan("handleApiError"),
		);
