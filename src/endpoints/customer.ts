import { WorkspaceApiClient, route } from "../httpClient";
import {
	type CreateCustomerRequest,
	type EditCustomerRequest,
	type GetCustomerResponse,
	GetCustomerResponseSchema,
	type ListCustomersQuerySchema,
	ListCustomersResponseSchema,
} from "../models/customer";

export const listCustomers = route<
	typeof ListCustomersQuerySchema.Type,
	typeof ListCustomersResponseSchema.Type
>({
	method: "get",
	url: "/api/v1/customers",
	client: WorkspaceApiClient,
	responseSchema: ListCustomersResponseSchema,
	allowBody: true,
});

export const getCustomer = route<GetCustomerResponse, `cust_${string}`>({
	method: "get",
	url: customerId => `/api/v1/customers/${customerId}`,
	client: WorkspaceApiClient,
	responseSchema: GetCustomerResponseSchema,
});
export const createCustomer = route<CreateCustomerRequest, GetCustomerResponse>(
	{
		method: "post",
		url: "/api/v1/customers",
		client: WorkspaceApiClient,
		responseSchema: GetCustomerResponseSchema,
	},
);

export const editCustomer = route<
	EditCustomerRequest,
	GetCustomerResponse,
	`cust_${string}`
>({
	method: "patch",
	url: customerId => `/api/v1/customers/${customerId}`,
	client: WorkspaceApiClient,
	responseSchema: GetCustomerResponseSchema,
});

export const deleteCustomer = route<
	never,
	GetCustomerResponse,
	`cust_${string}`
>({
	method: "del",
	url: customerId => `/api/v1/customers/${customerId}`,
	client: WorkspaceApiClient,
	responseSchema: GetCustomerResponseSchema,
});

export const getCustomerByExternalId = route<GetCustomerResponse>({
	method: "get",
	url: externalId =>
		`/api/v1/customers/by-external-id/${encodeURIComponent(externalId)}`,
	client: WorkspaceApiClient,
	responseSchema: GetCustomerResponseSchema,
});

export const editCustomerByExternalId = route<
	EditCustomerRequest,
	GetCustomerResponse
>({
	method: "patch",
	url: (externalId: string) =>
		`/api/v1/customers/by-external-id/${encodeURIComponent(externalId)}`,
	client: WorkspaceApiClient,
	responseSchema: GetCustomerResponseSchema,
});

export const deleteCustomerByExternalId = route<void, GetCustomerResponse>({
	method: "del",
	url: (externalId: string) =>
		`/api/v1/customers/by-external-id/${encodeURIComponent(externalId)}`,
	client: WorkspaceApiClient,
	responseSchema: GetCustomerResponseSchema,
});
