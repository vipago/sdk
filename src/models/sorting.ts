import { Schema } from "effect";

export const SortingStateSchema = Schema.Array(
	Schema.Struct({
		id: Schema.String,
		desc: Schema.Boolean,
	}),
);
export type SortingState = typeof SortingStateSchema.Type;
