import { Schema } from "effect";
import { WorkspaceApiClient, route } from "../../httpClient";
import {
	CreatePriceRequestSchema,
	EditPriceRequestSchema,
	GetPriceResponseSchema,
} from "../../models/products/prices";

// Create a price for a given product
export const createPrice = route({
	method: "post",
	url: (productId: `prod_${string}`) => `/api/v1/products/${productId}/prices`,
	client: WorkspaceApiClient,
	requestSchema: CreatePriceRequestSchema,
	responseSchema: GetPriceResponseSchema,
});

// List prices for a given product
export const listPricesOfProduct = route({
	method: "get",
	url: (productId: `prod_${string}`) => `/api/v1/products/${productId}/prices`,
	client: WorkspaceApiClient,
	responseSchema: Schema.Array(GetPriceResponseSchema),
});

// Edit a price by its ID
export const editPrice = route({
	method: "patch",
	url: (priceId: `price_${string}`) => `/api/v1/prices/${priceId}`,
	client: WorkspaceApiClient,
	requestSchema: EditPriceRequestSchema,
	responseSchema: GetPriceResponseSchema,
});

// Get a price by its ID
export const getPrice = route({
	method: "get",
	url: (priceId: `price_${string}`) => `/api/v1/prices/${priceId}`,
	client: WorkspaceApiClient,
	responseSchema: GetPriceResponseSchema,
});
