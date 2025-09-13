import { pipe, Schema } from "effect";
import { idSchema } from "../idGenerator";
import { GetWorkspaceResponseSchema } from "./workspace";
import { GetPriceResponseSchema } from "./products/prices";
import { DateMaybeFromString } from "./DateMaybeFromString";
const indexNumberSchema = Schema.NumberFromString.pipe(
	Schema.nonNaN(),
	Schema.nonNegative(),
	Schema.int(),
	Schema.finite(),
);
export const GetTrackItemSchema = Schema.Struct({
	plan: Schema.Union(indexNumberSchema, Schema.String),
	priceId: Schema.Union(idSchema("price"), GetPriceResponseSchema),
});
export const TrackId = idSchema("track", "track");
export const GetTrackResponseSchema = Schema.Struct({
	id: TrackId,
	workspaceId: Schema.Union(idSchema("wosp"), GetWorkspaceResponseSchema),
	name: Schema.NonEmptyString,
	codename: Schema.String,
	items: Schema.Array(GetTrackItemSchema),
	createdAt: DateMaybeFromString,
	updatedAt: DateMaybeFromString,
});
export const ExpandableTrackId = Schema.Union(TrackId, GetTrackResponseSchema);
export const CreateTrackRequestSchema = Schema.Struct({
	name: Schema.NonEmptyString,
	codename: Schema.String,
});

export const EditTrackRequestSchema = Schema.Struct({
	name: Schema.NonEmptyString,
	codename: Schema.String,
});

export const AddPlanToTrackRequestSchema = Schema.Struct({
	plan: GetTrackItemSchema.fields.plan,
	priceId: idSchema("price"),
	position: pipe(indexNumberSchema, Schema.optional),
});

export const MovePlanInTrackRequestSchema = Schema.Struct({
	newPosition: indexNumberSchema,
});
export const EditTrackPlanRequestSchema = pipe(
	Schema.Struct({
		plan: GetTrackItemSchema.fields.plan,
		priceId: idSchema("price"),
	}),
	Schema.partial,
);
