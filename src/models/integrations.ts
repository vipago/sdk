import { Schema } from "effect";
import { idSchema } from "../idGenerator";
import { GetWorkspaceResponseSchema } from "./workspace";

export namespace Integration {
	export const types = ["paypal", "pix", "stripe"] as const;
	export const Type = Schema.Literal(...types);
	export type Type = GetIntegrationResponse["data"]["_tag"];
	// Stripe Integration: Representa uma integração com o Stripe
	export const Stripe = Schema.TaggedStruct("stripe", {
		apiKey: Schema.NonEmptyString,
		publicApiKey: Schema.NonEmptyString,
	}).annotations({
		title: "Stripe",
	});
	// PayPal Integration: Representa uma integração com o PayPal
	export const PayPal = Schema.TaggedStruct("paypal", {
		clientId: Schema.NonEmptyString,
		clientSecret: Schema.NonEmptyString,
		environment: Schema.Literal("production", "sandbox"),
	}).annotations({
		title: "Paypal",
	});

	// PIX Integration: Representa uma integração com o PIX (exemplo fictício)
	export const Pix = Schema.TaggedStruct("pix", {
		pixKey: Schema.NonEmptyString,

		// Informações da empresa
		companyName: Schema.NonEmptyString, // Nome da empresa
		companyTaxId: Schema.NonEmptyString, // CNPJ ou CPF da empresa

		// Endereço de faturamento (somente Brasil)
		billingAddress: Schema.Struct({
			street: Schema.NonEmptyString,
			number: Schema.NonEmptyString,
			complement: Schema.optional(Schema.NonEmptyString),
			neighborhood: Schema.NonEmptyString,
			city: Schema.NonEmptyString,
			state: Schema.NonEmptyString, // UF
			zipCode: Schema.NonEmptyString,
		}),

		// Informações de contato
		contact: Schema.Struct({
			name: Schema.NonEmptyString,
			email: Schema.NonEmptyString,
			phone: Schema.NonEmptyString,
		}),
	}).annotations({
		title: "Pix",
	});

	// Union de todos os tipos de integração
	export const Integration = Schema.Union(Stripe, PayPal, Pix).annotations({
		examples: [
			{
				_tag: "stripe",
				apiKey: "sk_test_123",
				publicApiKey: "pk_test_123",
			},
			{
				_tag: "paypal",
				clientId: "client_id_123",
				clientSecret: "client_secret_456",
				environment: "sandbox",
			},
		],
		title: "Integração",
	});
}

export namespace IntegrationState {
	export const IntegrationState = Schema.Literal(
		"validating",
		"connected",
		"invalid",
	).annotations({
		examples: ["connected"],
		title: "IntegrationState",
		description: "Estado da integração",
	});
}

// Schema para a resposta de uma integração no banco de dados
export const GetIntegrationResponseSchema = Schema.Struct({
	id: idSchema("intgr", "Integração"),
	workspaceId: Schema.Union(
		idSchema("wosp", "Workspace"),
		GetWorkspaceResponseSchema,
	).annotations({
		description: "Id da workspace da integração (Expandivel)",
	}), // Relacionamento com o cliente
	data: Integration.Integration.annotations({
		description: "Detalhes da integração",
	}),
	state: IntegrationState.IntegrationState,
	webhookId: Schema.String,
	webhookSecret: Schema.String,
});

export type GetIntegrationResponse = typeof GetIntegrationResponseSchema.Type;

// Schema para criar uma nova integração
export const CreateIntegrationRequestSchema = Integration.Integration;

export type CreateIntegrationRequest =
	typeof CreateIntegrationRequestSchema.Encoded;

// Schema para editar uma integração existente
export const EditIntegrationRequestSchema = Integration.Integration;

export type EditIntegrationRequest = typeof EditIntegrationRequestSchema.Type;

// Schema para listar integrações
export const ListIntegrationsResponseSchema = GetIntegrationResponseSchema.pipe(
	Schema.Array,
);

export type ListIntegrationsResponse =
	typeof ListIntegrationsResponseSchema.Type;
