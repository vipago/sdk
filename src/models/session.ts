import { Schema } from "effect";
import { Email } from "./emailValidator";

export const PasswordLoginRequestSchema = Schema.Struct({
	email: Email,
	password: Schema.String,
});
export type PasswordLoginRequest = typeof PasswordLoginRequestSchema.Type;

export const PasswordLoginResponseSchema = Schema.Struct({
	id: Schema.String,
	createdAt: Schema.String,
	updatedAt: Schema.String,
	userId: Schema.String,
	expiresAt: Schema.String,
});
export type PasswordLoginResponse = typeof PasswordLoginResponseSchema.Type;
