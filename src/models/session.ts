import { Schema } from "effect";
import { Email } from "./emailValidator";

export const PasswordLoginRequestSchema = Schema.Struct({
	email: Email,
	password: Schema.NonEmptyString,
});
export type PasswordLoginRequest = typeof PasswordLoginRequestSchema.Type;

export const PasswordLoginResponseSchema = Schema.Struct({
	id: Schema.NonEmptyString,
	createdAt: Schema.NonEmptyString,
	updatedAt: Schema.NonEmptyString,
	userId: Schema.NonEmptyString,
	expiresAt: Schema.NonEmptyString,
});
export type PasswordLoginResponse = typeof PasswordLoginResponseSchema.Type;
