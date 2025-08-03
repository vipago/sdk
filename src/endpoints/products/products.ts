import { WorkspaceApiClient, route } from "../../httpClient";
import {
	type CreateProductRequest,
	type EditProductRequest,
	type GetProductResponse,
	GetProductResponseSchema,
	type ListProductsRequest,
	type ListProductsResponse,
	ListProductsResponseSchema,
} from "../../models/products/products";

export const listProducts = route<ListProductsRequest, ListProductsResponse>({
	method: "get",
	url: "/api/v1/products",
	client: WorkspaceApiClient,
	responseSchema: ListProductsResponseSchema,
	allowBody: true,
});

export const getProducts = route({
	method: "get",
	url: (productId: string) => `/api/v1/products/${productId}`,
	client: WorkspaceApiClient,
	responseSchema: GetProductResponseSchema,
});

export const createProduct = route<CreateProductRequest, GetProductResponse>({
	method: "post",
	url: "/api/v1/products",
	client: WorkspaceApiClient,
	responseSchema: GetProductResponseSchema,
});

export const editProduct = route<
	EditProductRequest,
	GetProductResponse,
	`prod_${string}`
>({
	method: "patch",
	url: productId => `/api/v1/products/${productId}`,
	client: WorkspaceApiClient,
	responseSchema: GetProductResponseSchema,
});
