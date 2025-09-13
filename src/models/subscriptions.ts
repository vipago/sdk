import { pipe, Schema } from "effect";
import { idSchema } from "../idGenerator";
import { ExpandableWorkspaceId } from "./workspace";
import { CustomerId, ExpandableCustomerId } from "./customer";
import { ExpandableTrackId, GetTrackItemSchema, TrackId } from "./tracks";
import { ExpandablePriceId, PriceId } from "./products/prices";
import { DateMaybeFromString } from "./DateMaybeFromString";
import { ExpandableInvoiceId } from "..";

export const SubscriptionStatusSchema = Schema.Literal(
	"active",
	"zombie",
	"expired",
);
const TrackPart = Schema.Union(
	Schema.Struct({
		trackId: ExpandableTrackId,
		plan: GetTrackItemSchema.fields.plan,
		outdatedPlan: Schema.Boolean.annotations({
			description:
				"Indica se o preço do plano foi alterado e esta subscrição ainda tem o plano/preço antigo",
		}),
	}),
	Schema.Struct({}),
);
export const SubscriptionId = idSchema("sub", "subscrição");
export const GetSubscriptionResponseSchema = pipe(
	Schema.Struct({
		id: SubscriptionId,
		workspaceId: ExpandableWorkspaceId,
		customerId: ExpandableCustomerId,
		priceId: ExpandablePriceId,
		anchor: DateMaybeFromString,
		paymentMethodId: Schema.String,
		createdAt: DateMaybeFromString,
		updatedAt: DateMaybeFromString,
		status: SubscriptionStatusSchema,
	}),
	Schema.extend(TrackPart),
);
export const ExpandableSubscriptionId = Schema.Union(
	SubscriptionId,
	GetSubscriptionResponseSchema,
);
const TrackPartOnRequest = pipe(
	Schema.Struct({
		plan: GetTrackItemSchema.fields.plan,
	}),
	Schema.extend(
		Schema.Union(
			Schema.Struct({
				trackId: TrackId,
			}),
			Schema.Struct({
				trackCodeName: Schema.String,
			}),
		),
	),
);
const TrackPartOnRequestOptional = Schema.Union(
	TrackPartOnRequest,
	Schema.Struct({}),
);
export const ListSubscriptionQuerySchema = pipe(
	Schema.Struct({
		customerId: CustomerId,
		priceId: PriceId,
	}),
	Schema.partial,
	Schema.extend(TrackPartOnRequestOptional),
);

export const EditSubscriptionRequestSchema = pipe(
	Schema.Struct({
		status: Schema.Literal("cancel", "active"),
		resetAnchor: Schema.Union(Schema.Literal("now"), DateMaybeFromString),
	}),
	Schema.partial,
);

export const RequestPlanChangeRequestSchema = pipe(
	Schema.Union(
		TrackPartOnRequest,
		Schema.Struct({
			priceId: PriceId,
		}),
	),
	Schema.extend(
		Schema.Struct({
			cancelInvoiceOnAutoPaymentFailure: Schema.Boolean,
		}),
	),
);

export const RequestPlanChangeResponseSchema = Schema.Struct({
	invoiceId: Schema.suspend(() => ExpandableInvoiceId),
	charged: Schema.Boolean,
});
