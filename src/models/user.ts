import { Schema } from "effect";
import { UserFeatures } from "../features";
import { idSchema } from "../idGenerator";
import { Email } from "./emailValidator";

export const GetUserResponseSchema = Schema.Struct({
	id: idSchema("us", "user"),
	name: Schema.String,
	email: Email.annotations({
		description: "Email do usuário",
	}),
	features: Schema.Array(UserFeatures.VALIDATOR).annotations({
		description:
			"Permissões e funcionalidades do usuário. Controla as permissões e a funcionalidades que o usuário pode usar e diferentes rotas precisam de features diferentes.",
	}),
	createdAt: Schema.String,
	updatedAt: Schema.String,
}).annotations({
	title: "User",
});

export type GetUserResponse = typeof GetUserResponseSchema.Type;

export const GetUserByEmailResponseSchema = Schema.Struct({
	id: idSchema("us", "user"),
	name: Schema.String,
	email: Email.annotations({
		description: "User's email",
	}),
}).annotations({
	title: "User (parcial)",
});

export type GetUserByEmailResponse = typeof GetUserByEmailResponseSchema.Type;
