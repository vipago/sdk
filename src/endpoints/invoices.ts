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

export const createInvoice = route<
	models.CreateInvoiceRequest,
	models.GetInvoiceResponse
>({
	method: "post",
	url: "/api/v1/invoices",
	client: WorkspaceApiClient,
	responseSchema: models.GetInvoiceResponseSchema,
});

export const payInvoice = route<
	models.PayInvoiceRequest,
	models.PayInvoiceResponse,
	`inv_${string}`
>({
	method: "post",
	url: invoiceId => `/api/v1/invoices/${invoiceId}/pay`,
	client: WorkspaceApiClient,
	responseSchema: models.PayInvoiceResponseSchema,
});
