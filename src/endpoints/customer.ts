import { WorkspaceApiClient, route } from "../httpClient";
import {
	CreateCustomerRequestSchema,
	EditCustomerRequestSchema,
	type GetCustomerResponse,
	GetCustomerResponseSchema,
	ListCustomersQuerySchema,
	ListCustomersResponseSchema,
} from "../models/customer";

export const listCustomers = route({
	method: "get",
	url: "/api/v1/customers",
	client: WorkspaceApiClient,
	responseSchema: ListCustomersResponseSchema,
	requestSchema: ListCustomersQuerySchema,
	allowBody: true,
});

export const getCustomer = route<GetCustomerResponse, `cust_${string}`>({
	method: "get",
	url: customerId => `/api/v1/customers/${customerId}`,
	client: WorkspaceApiClient,
	responseSchema: GetCustomerResponseSchema,
});
export const createCustomer = route({
	method: "post",
	url: "/api/v1/customers",
	client: WorkspaceApiClient,
	requestSchema: CreateCustomerRequestSchema,
	responseSchema: GetCustomerResponseSchema,
});

export const editCustomer = route({
	method: "patch",
	url: (customerId: `cust_${string}`) => `/api/v1/customers/${customerId}`,
	client: WorkspaceApiClient,
	requestSchema: EditCustomerRequestSchema,
	responseSchema: GetCustomerResponseSchema,
});

export const deleteCustomer = route({
	method: "del",
	url: (customerId: `cust_${string}`) => `/api/v1/customers/${customerId}`,
	client: WorkspaceApiClient,
	responseSchema: GetCustomerResponseSchema,
});

export const getCustomerByExternalId = route({
	method: "get",
	url: externalId =>
		`/api/v1/customers/by-external-id/${encodeURIComponent(externalId)}`,
	client: WorkspaceApiClient,
	responseSchema: GetCustomerResponseSchema,
});

export const editCustomerByExternalId = route({
	method: "patch",
	url: (externalId: string) =>
		`/api/v1/customers/by-external-id/${encodeURIComponent(externalId)}`,
	client: WorkspaceApiClient,
	requestSchema: EditCustomerRequestSchema,
	responseSchema: GetCustomerResponseSchema,
});

export const deleteCustomerByExternalId = route({
	method: "del",
	url: (externalId: string) =>
		`/api/v1/customers/by-external-id/${encodeURIComponent(externalId)}`,
	client: WorkspaceApiClient,
	responseSchema: GetCustomerResponseSchema,
});
