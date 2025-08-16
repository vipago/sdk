import { Schema } from "effect";
import type { WorkspaceFeatures } from "../features";
import {
	AuthenticatedApiClient,
	WorkspaceApiClient,
	route,
} from "../httpClient";
import type { GetUserResponse } from "../models/user";
import {
	AddOrUpdateMemberRequestSchema,
	type CreateWorkspaceRequest,
	EditWorkspaceRequestSchema,
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

export const editWorkspace = route({
	method: "patch",
	url: "/api/v1/workspaces",
	client: WorkspaceApiClient,
	requestSchema: EditWorkspaceRequestSchema,
	responseSchema: GetWorkspaceResponseSchema,
	name: "edit workspace request",
});

export const getSelfWorkspace = route({
	method: "get",
	url: "/api/v1/workspaces/self",
	client: WorkspaceApiClient,
	responseSchema: GetWorkspaceResponseSchema,
});

export const listWorkspaces = route({
	method: "get",
	url: "/api/v1/workspaces",
	client: WorkspaceApiClient,
	responseSchema: Schema.Array(GetWorkspaceResponseSchema),
});

export const putWorkspaceMember = route({
	method: "put",
	url: (id: GetUserResponse["id"]) =>
		`/api/v1/workspaces/members/${encodeURIComponent(id)}`,
	client: WorkspaceApiClient,
	requestSchema: AddOrUpdateMemberRequestSchema,
});

export const deleteWorkspaceMember = route<GetUserResponse["id"]>({
	method: "del",
	url: id => `/api/v1/workspaces/members/${encodeURIComponent(id)}`,
	client: WorkspaceApiClient,
});

export const listWorkspaceMembers = route({
	method: "get",
	url: "/api/v1/workspaces/members",
	client: WorkspaceApiClient,
	responseSchema: ListMembersResponseSchema,
});

export const getWorkspaceMember = route({
	method: "get",
	url: (userId: `us_${string}`) =>
		`/api/v1/workspaces/members/${encodeURIComponent(userId)}`,
	client: WorkspaceApiClient,
	responseSchema: GetMemberResponseSchema,
});
