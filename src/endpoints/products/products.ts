import { WorkspaceApiClient, route } from "../../httpClient";
import {
	CreateProductRequestSchema,
	EditProductRequestSchema,
	GetProductResponseSchema,
	ListProductsRequestSchema,
	ListProductsResponseSchema,
} from "../../models/products/products";

export const listProducts = route({
	method: "get",
	url: "/api/v1/products",
	client: WorkspaceApiClient,
	requestSchema: ListProductsRequestSchema,
	responseSchema: ListProductsResponseSchema,
	allowBody: true,
});

export const getProduct = route({
	method: "get",
	url: (productId: string) => `/api/v1/products/${productId}`,
	client: WorkspaceApiClient,
	responseSchema: GetProductResponseSchema,
});

export const createProduct = route({
	method: "post",
	url: "/api/v1/products",
	client: WorkspaceApiClient,
	requestSchema: CreateProductRequestSchema,
	responseSchema: GetProductResponseSchema,
});

export const editProduct = route({
	method: "patch",
	url: (productId: `prod_${string}`) => `/api/v1/products/${productId}`,
	client: WorkspaceApiClient,
	requestSchema: EditProductRequestSchema,
	responseSchema: GetProductResponseSchema,
});
