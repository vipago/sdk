import { pipe, Schema } from "effect";
import { idSchema } from "../idGenerator";
import { GetWorkspaceResponseSchema } from "./workspace";
import { GetCustomerResponseSchema } from "./customer";
import { GetTrackItemSchema, GetTrackResponseSchema } from "./tracks";
import { GetPriceResponseSchema } from "./products/prices";
import { DateMaybeFromString } from "./DateMaybeFromString";
import { expand, GetInvoiceResponseSchema } from "..";

export const SubscriptionStatusSchema = Schema.Literal(
	"active",
	"zombie",
	"expired",
);
const TrackPart = Schema.Union(
	Schema.Struct({
		trackId: Schema.Union(idSchema("track"), GetTrackResponseSchema),
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
		id: idSchema("sub"),
		workspaceId: Schema.Union(idSchema("wosp"), GetWorkspaceResponseSchema),
		customerId: Schema.Union(idSchema("cust"), GetCustomerResponseSchema),
		priceId: Schema.Union(idSchema("price"), GetPriceResponseSchema),
		anchor: DateMaybeFromString,
		paymentMethodId: Schema.String,
		createdAt: DateMaybeFromString,
		updatedAt: DateMaybeFromString,
		status: SubscriptionStatusSchema,
	}),
	Schema.extend(TrackPart),
);
const TrackPartOnRequest = pipe(
	Schema.Struct({
		plan: GetTrackItemSchema.fields.plan,
	}),
	Schema.extend(
		Schema.Union(
			Schema.Struct({
				trackId: idSchema("track"),
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
		customerId: idSchema("cust"),
		priceId: idSchema("price"),
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
			priceId: idSchema("price"),
		}),
	),
	Schema.extend(
		Schema.Struct({
			cancelInvoiceOnAutoPaymentFailure: Schema.Boolean,
		}),
	),
);

export const RequestPlanChangeResponseSchema = Schema.Struct({
	invoiceId: Schema.Union(idSchema("inv"), GetInvoiceResponseSchema),
	charged: Schema.Boolean,
});
