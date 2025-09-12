import { route, WorkspaceApiClient } from "../httpClient";
import {
	AddPlanToTrackRequestSchema,
	CreateTrackRequestSchema,
	EditTrackPlanRequestSchema,
	GetTrackResponseSchema,
	MovePlanInTrackRequestSchema,
} from "../models/tracks";

export const createEmptyTrack = route({
	requestSchema: CreateTrackRequestSchema,
	responseSchema: GetTrackResponseSchema,
	url: "/api/v1/tracks",
	method: "post",
	client: WorkspaceApiClient,
});
export const getTrack = route({
	responseSchema: GetTrackResponseSchema,
	url: (id: `track_${string}`) => `/api/v1/tracks/${encodeURIComponent(id)}`,
	client: WorkspaceApiClient,
	method: "get",
});
export const deleteTrack = route({
	url: (id: `track_${string}`) => `/api/v1/tracks/${encodeURIComponent(id)}`,
	method: "del",
	client: WorkspaceApiClient,
});
// ---------------- Plans ----------------

export const addPlanToTrack = route({
	url: (id: `track_${string}`) =>
		`/api/v1/tracks/${encodeURIComponent(id)}/plans`,
	client: WorkspaceApiClient,
	requestSchema: AddPlanToTrackRequestSchema,
	method: "post",
});
type PlanQueryId = number | `plan-${string | number}`;
export const movePlanInTrack = route({
	url: ([id, oldPosition]: [`track_${string}`, PlanQueryId]) =>
		`/api/v1/tracks/${encodeURIComponent(id)}/plans/${oldPosition}/position`,
	method: "patch",
	client: WorkspaceApiClient,
	requestSchema: MovePlanInTrackRequestSchema,
});

export const editPlanInTrack = route({
	url: ([id, position]: [`track_${string}`, PlanQueryId]) =>
		`/api/v1/tracks/${encodeURIComponent(id)}/plans/${position}`,
	method: "patch",
	client: WorkspaceApiClient,
	requestSchema: EditTrackPlanRequestSchema,
});

export const detachPlanFromTrack = route({
	url: ([id, position]: [`track_${string}`, PlanQueryId]) =>
		`/api/v1/tracks/${encodeURIComponent(id)}/plans/${position}`,
	method: "del",
	client: WorkspaceApiClient,
});
