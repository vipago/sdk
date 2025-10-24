import { Schema } from "effect";

export const indexNumberSchema = (
	s: Schema.Schema<number, any, never> = Schema.Number,
) => s.pipe(Schema.nonNegative(), Schema.int());

export const trackPlanNumber = (
	s: Schema.Schema<number, any, never> = Schema.Number,
) => Schema.Union(indexNumberSchema(s), Schema.String);
