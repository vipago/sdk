import { idSchema } from "../idGenerator";

export const CustomerId = idSchema("cust", "cliente");
export const InvoiceId = idSchema("inv", "fatura");
export const TrackId = idSchema("track", "track");
export const UserId = idSchema("us", "usuário");
export const PaymentMethodId = idSchema("pm", "Método de Pagamento");
export const PriceId = idSchema("price", "preço");
export const ProductId = idSchema("prod", "produto");
export const WorkspaceId = idSchema("wosp", "workspace");
export const SubscriptionId = idSchema("sub", "subscrição");
export const WebhookId = idSchema("wh", "webhook");
export const WebhookDeliveryId = idSchema("whevt", "webhook delivery");
