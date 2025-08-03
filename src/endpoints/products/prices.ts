import { Schema } from "effect";
import { WorkspaceApiClient, route } from "../../httpClient";
import {
	type CreatePriceRequest,
	type EditPriceRequest,
	type GetPriceResponse,
	GetPriceResponseSchema,
} from "../../models/products/prices";

// Create a price for a given product
export const createPrice = route<
	CreatePriceRequest,
	GetPriceResponse,
	`prod_${string}`
>({
	method: "post",
	url: productId => `/api/v1/products/${productId}/prices`,
	client: WorkspaceApiClient,
	responseSchema: GetPriceResponseSchema,
});

// List prices for a given product
export const listPricesOfProduct = route<
	readonly GetPriceResponse[],
	`prod_${string}`
>({
	method: "get",
	url: productId => `/api/v1/products/${productId}/prices`,
	client: WorkspaceApiClient,
	responseSchema: Schema.Array(GetPriceResponseSchema),
});

// Edit a price by its ID
export const editPrice = route<
	EditPriceRequest,
	GetPriceResponse,
	`price_${string}`
>({
	method: "patch",
	url: priceId => `/api/v1/prices/${priceId}`,
	client: WorkspaceApiClient,
	responseSchema: GetPriceResponseSchema,
});

// Get a price by its ID
export const getPrice = route<GetPriceResponse, `price_${string}`>({
	method: "get",
	url: priceId => `/api/v1/prices/${priceId}`,
	client: WorkspaceApiClient,
	responseSchema: GetPriceResponseSchema,
});
