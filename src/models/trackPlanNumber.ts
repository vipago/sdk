import { Schema } from "effect";

export const indexNumberSchema = Schema.Union(
	Schema.NumberFromString,
	Schema.Number,
).pipe(Schema.positive(), Schema.int());

export const trackPlanNumber = Schema.Union(indexNumberSchema, Schema.String);
