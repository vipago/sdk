import { Schema } from "effect";

export const SubscriptionStatusSchema = Schema.Literal(
	"active",
	"canceled",
	"paused",
	"expired",
);
