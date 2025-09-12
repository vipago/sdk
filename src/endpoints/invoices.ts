import { WorkspaceApiClient, route } from "../httpClient";
import * as models from "../models/invoices";

export const listInvoices = route({
	method: "get",
	url: "/api/v1/invoices",
	client: WorkspaceApiClient,
	requestSchema: models.InvoiceListOptions,
	responseSchema: models.InvoiceListResultSchema,
	allowBody: true,
});

export const getInvoice = route({
	method: "get",
	url: (invoiceId: string) => `/api/v1/invoices/${invoiceId}`,
	client: WorkspaceApiClient,
	responseSchema: models.GetInvoiceResponseSchema,
});

export const createInvoice = route({
	method: "post",
	url: "/api/v1/invoices",
	client: WorkspaceApiClient,
	requestSchema: models.CreateInvoiceRequestSchema,
	responseSchema: models.GetInvoiceResponseSchema,
});

export const payInvoice = route({
	method: "post",
	url: (invoiceId: `inv_${string}`) => `/api/v1/invoices/${invoiceId}/pay`,
	client: WorkspaceApiClient,
	requestSchema: models.PayInvoiceRequestSchema,
	responseSchema: models.PayInvoiceResponseSchema,
});

export const cancelInvoice = route({
	method: "del",
	url: (invoiceId: `inv_${string}`) => `/api/v1/invoices/${invoiceId}`,
	client: WorkspaceApiClient,
});
