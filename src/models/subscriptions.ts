import { Schema, pipe } from "effect";
import { DateMaybeFromString } from "./DateMaybeFromString";
import { ExpandableCustomerId } from "./customer";
import { CustomerId, PriceId, SubscriptionId, TrackId } from "./ids";
import { ExpandableInvoiceId } from "./invoices";
import { LargeListOptions, PagedListResponse } from "./listOptions";
import { ExpandablePriceId } from "./products/prices";
import { ExpandableTrackId, GetTrackItemSchema } from "./tracks";
import { ExpandableWorkspaceId } from "./workspace";

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
export const GetSubscriptionResponseSchema = pipe(
	Schema.Struct({
		id: SubscriptionId,
		workspaceId: ExpandableWorkspaceId,
		customerId: ExpandableCustomerId,
		priceId: ExpandablePriceId,
		anchor: DateMaybeFromString,
		paymentMethodId: Schema.String.pipe(Schema.NullOr),
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
		...LargeListOptions,
	}),
	Schema.partial,
	Schema.extend(TrackPartOnRequestOptional),
);
ListSubscriptionQuerySchema.Encoded satisfies Record<string, string>;
export const ListSubscriptionResponseSchema = PagedListResponse(
	GetSubscriptionResponseSchema,
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
	invoiceId: ExpandableInvoiceId,
	charged: Schema.Boolean,
});
