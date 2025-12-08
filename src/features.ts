import { Schema } from "effect";

type ElementsOfSet<S> = S extends Set<infer T> ? T : never;

export namespace UserFeatures {
	export const ANONYMOUS_FEATURES = new Set([
		"session:create",
		"user:login",
	] satisfies Feature[]);
	export const AVAILABLE_FEATURES = new Set([
		"workspace:create",
		"workspace:read:all",
		"session:create",
		"session:delete",
		"user:login",
		"workspace:integrations:bind:create",
		"workspace:integrations:bind:delete",
		"nuked",
		"user:read",
		"devtools",
		"integrations:read:unapproved",
		"admin:panel",
		"admin:integrations"
	] as const);
	export type Feature = ElementsOfSet<typeof AVAILABLE_FEATURES>;
	export const DEFAULT_FEATURES = new Set([
		"workspace:create",
		"workspace:read:all",
		"session:create",
		"session:delete",
		"user:login",
	] satisfies Feature[]);

	export const VALIDATOR = Schema.Literal(...AVAILABLE_FEATURES);
}
export namespace WorkspaceFeatures {
	export const AVAILABLE_FEATURES = new Set([
		"workspace:update",
		"workspace:read",
		"workspace:delete",
		"products:create",
		"products:delete",
		"products:update",
		"products:read",
		"products:prices:create",
		"products:prices:archive",
		"products:prices:update",
		"products:prices:read",
		"members:put",
		"members:delete",
		"members:read",
		"checkout:session:create",
		"customers:create",
		"customers:read",
		"customers:update",
		"customers:delete",
		"private_api_key:read",
		"checkout:session:auto_localization",
		"integrations:setup",
		"integrations:read",
		"integrations:disconnect",
		"list_available_payment_methods",
		"payment_methods:create",
		"payment_methods:delete",
		"payment_methods:read",
		"invoices:create",
		"invoices:read",
		"invoices:void",
		"subscriptions:read",
		"subscriptions:edit",
		"tracks:create",
		"tracks:read",
		"tracks:delete",
		"tracks:update",
		"webhooks:read",
		"webhooks:write",
		"webhooks:deliveries:read",
		"webhooks:deliveries:retry",
	] as const);
	export type Feature = ElementsOfSet<typeof AVAILABLE_FEATURES>;
	export const DEFAULT_FEATURES: Set<Feature> = new Set([
		"workspace:update",
		"workspace:read",
		"workspace:delete",
		"products:create",
		"products:delete",
		"customers:create",
		"customers:read",
		"customers:update",
		"customers:delete",
		"products:update",
		"products:read",
		"products:prices:create",
		"products:prices:archive",
		"products:prices:update",
		"products:prices:read",
		"members:put",
		"members:delete",
		"members:read",
		"checkout:session:create",
		"private_api_key:read",
		"integrations:setup",
		"integrations:read",
		"integrations:disconnect",
		"list_available_payment_methods",
		"payment_methods:create",
		"payment_methods:delete",
		"payment_methods:read",
		"invoices:create",
		"invoices:read",
		"invoices:void",
		"subscriptions:read",
		"subscriptions:edit",
		"tracks:create",
		"tracks:read",
		"tracks:delete",
		"tracks:update",
		"webhooks:read",
		"webhooks:write",
		"webhooks:deliveries:read",
		"webhooks:deliveries:retry",
	] as const);
	export const VALIDATOR = Schema.Literal(...AVAILABLE_FEATURES).annotations({
		title: "Permissão",
	});
}
