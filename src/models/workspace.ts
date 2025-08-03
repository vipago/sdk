import { Schema } from "effect";
import { WorkspaceFeatures } from "../features";
import { idSchema } from "../idGenerator";
import { GetUserResponseSchema } from "./user";

export const GetWorkspaceResponseSchema = Schema.Struct({
	id: idSchema("wosp", "workspace"),
	name: Schema.String,
	ownerId: Schema.Union(
		idSchema("us", "user"),
		GetUserResponseSchema,
	).annotations({
		title: "Dono",
		description: "ID do usuário que criou a workspace (Expandivel)",
	}),
	features: Schema.Array(WorkspaceFeatures.VALIDATOR),
	privateApiKey: Schema.optional(idSchema("pk", "workspace")).annotations({
		title: "Chave privada da workspace",
		description:
			"Essa chave pode ser usada como chave de API da vipago. Como já é associada a uma workspace, não precisa do header `X-Use-Workspace` quando essa chave é utilizada.",
	}),
	logoUrl: Schema.optional(Schema.String),
	createdAt: Schema.DateFromString,
	updatedAt: Schema.DateFromString,
}).annotations({
	description: "Workspace",
	title: "Workspace",
});

export type GetWorkspaceResponse = typeof GetWorkspaceResponseSchema.Type;

export const CreateWorkspaceRequestSchema = Schema.Struct({
	name: Schema.String,
	logoUrl: Schema.optional(Schema.String),
});
export type CreateWorkspaceRequest = typeof CreateWorkspaceRequestSchema.Type;

export const EditWorkspaceRequestSchema = Schema.Struct({
	name: Schema.optional(Schema.String),
	logoUrl: Schema.optional(Schema.String),
});
export type EditWorkspaceRequest = typeof EditWorkspaceRequestSchema.Type;

export const GetMemberResponseSchema = Schema.Struct({
	userId: Schema.Union(
		idSchema("us", "user"),
		GetUserResponseSchema,
	).annotations({
		title: "ID do usuário (Expandivel)",
	}),
	workspaceId: Schema.Union(
		idSchema("wosp", "workspace"),
		GetWorkspaceResponseSchema,
	).annotations({
		title: "ID da workspace (Expandivel)",
	}),
	features: Schema.Array(WorkspaceFeatures.VALIDATOR),
	createdAt: Schema.DateFromString,
	updatedAt: Schema.DateFromString,
}).annotations({
	title: "Workspace Membership",
});

export type GetMemberResponse = typeof GetMemberResponseSchema.Type;

export const ListMembersResponseSchema = Schema.Array(GetMemberResponseSchema);

export type ListMembersResponse = typeof ListMembersResponseSchema.Type;

export const AddOrUpdateMemberRequestSchema = Schema.Struct({
	features: Schema.Array(WorkspaceFeatures.VALIDATOR),
});

export type AddOrUpdateMemberRequest =
	typeof AddOrUpdateMemberRequestSchema.Type;
