import { Schema } from "effect";
import type { WorkspaceFeatures } from "../features";
import {
	AuthenticatedApiClient,
	WorkspaceApiClient,
	route,
} from "../httpClient";
import type { GetUserResponse } from "../models/user";
import {
	type AddOrUpdateMemberRequest,
	type CreateWorkspaceRequest,
	type EditWorkspaceRequest,
	type GetMemberResponse,
	GetMemberResponseSchema,
	type GetWorkspaceResponse,
	GetWorkspaceResponseSchema,
	ListMembersResponseSchema,
} from "../models/workspace";

export const createWorkspace = route<
	CreateWorkspaceRequest,
	GetWorkspaceResponse
>({
	method: "post",
	url: "/api/v1/workspaces",
	client: AuthenticatedApiClient,
	responseSchema: GetWorkspaceResponseSchema,
});

export const editWorkspace = route<EditWorkspaceRequest, GetWorkspaceResponse>({
	method: "patch",
	url: "/api/v1/workspaces",
	client: WorkspaceApiClient,
	responseSchema: GetWorkspaceResponseSchema,
	name: "edit workspace request",
});

export const getSelfWorkspace = route<GetWorkspaceResponse>({
	method: "get",
	url: "/api/v1/workspaces/self",
	client: WorkspaceApiClient,
	responseSchema: GetWorkspaceResponseSchema,
});

export const listWorkspaces = route<
	readonly (typeof GetWorkspaceResponseSchema.Type)[]
>({
	method: "get",
	url: "/api/v1/workspaces",
	client: WorkspaceApiClient,
	responseSchema: Schema.Array(GetWorkspaceResponseSchema),
});

export const putWorkspaceMember = (
	id: GetUserResponse["id"],
	features: WorkspaceFeatures.Feature[],
) =>
	route<AddOrUpdateMemberRequest>({
		method: "put",
		url: `/api/v1/workspaces/members/${encodeURIComponent(id)}`,
		client: WorkspaceApiClient,
	})({ features });

export const deleteWorkspaceMember = route<GetUserResponse["id"]>({
	method: "del",
	url: id => `/api/v1/workspaces/members/${encodeURIComponent(id)}`,
	client: WorkspaceApiClient,
});

export const listWorkspaceMembers = route<
	typeof ListMembersResponseSchema.Type
>({
	method: "get",
	url: "/api/v1/workspaces/members",
	client: WorkspaceApiClient,
	responseSchema: ListMembersResponseSchema,
});

export const getWorkspaceMember = route<GetMemberResponse, `us_${string}`>({
	method: "get",
	url: userId => `/api/v1/workspaces/members/${encodeURIComponent(userId)}`,
	client: WorkspaceApiClient,
	responseSchema: GetMemberResponseSchema,
});
