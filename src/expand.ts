import { Schema } from "effect";
import type * as tf from "type-fest";
import { GetProductResponseSchema } from "./models/products/products";
import { GetUserResponseSchema } from "./models/user";
import { GetWorkspaceResponseSchema } from "./models/workspace";
import { GetCustomerResponseSchema } from "./models/customer";
import { GetInvoiceResponseSchema } from "./models/invoices";
import { GetPaymentMethodResponseSchema } from "./models/paymentMethods";
import { GetIntegrationResponseSchema } from "./models/integrations";
import { GetPriceResponseSchema } from "./models/products/prices";

export const PrefixSchemaMap = {
	us: GetUserResponseSchema,
	wosp: GetWorkspaceResponseSchema,
	prod: GetProductResponseSchema,
	cust: GetCustomerResponseSchema,
	inv: GetInvoiceResponseSchema,
	pm: GetPaymentMethodResponseSchema,
	intgr: GetIntegrationResponseSchema,
	price: GetPriceResponseSchema,
};
export type PrefixMap = tf.SimplifyDeep<{
	[K in keyof typeof PrefixSchemaMap]: (typeof PrefixSchemaMap)[K]["Type"];
}>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export type IsExpandableUnion<T> = IsUnion<T> extends true
	? T extends string
		? T extends `${infer Prefix}_${string}`
			? Prefix extends keyof PrefixMap
				? true
				: false
			: false
		: T extends PrefixMap[keyof PrefixMap]
			? true
			: false
	: false;
type KeyMatchesExpand<K, E extends string> = K extends string
	? K extends E
		? K
		: E extends `${K}.${string}`
			? K
			: never
	: never;
export type GenerateExpandPaths<T, Path extends string = ""> = (
	T extends readonly (infer ArrayElement)[]
		? GenerateExpandPaths<ArrayElement, Path>
		: T extends object
			? {
					[K in keyof T]: NonNullable<
						T[K]
					> extends readonly (infer ArrayElement)[]
						? IsExpandableUnion<ArrayElement> extends true
							?
									| `${Path}${K & string}`
									| GenerateExpandPaths<
											NonNullable<Exclude<ArrayElement, string>>,
											`${Path}${K & string}.`
									  >
							: GenerateExpandPaths<ArrayElement, `${Path}${K & string}.`>
						: IsExpandableUnion<NonNullable<T[K]>> extends true
							?
									| `${Path}${K & string}`
									| GenerateExpandPaths<
											NonNullable<Exclude<T[K], string>>,
											`${Path}${K & string}.`
									  >
							: GenerateExpandPaths<NonNullable<T[K]>, `${Path}${K & string}.`>;
				}[keyof T]
			: never
) extends infer R extends string | undefined | null
	? NonNullable<R>
	: never;

type ExpandRemaindersFor<
	K extends string,
	E extends string,
> = E extends `${K}.${infer Rest}` ? Rest : E extends K ? "" : never;

export type ExpandAll<T, E extends GenerateExpandPaths<T>> = /* tf.Simplify< */
T extends ReadonlyArray<infer U extends object>
	? ReadonlyArray<ExpandAll<U, Extract<E, GenerateExpandPaths<U>>>>
	: tf.Merge<
			T,
			{
				[K in keyof T as K extends string
					? KeyMatchesExpand<K, GenerateExpandPaths<T>>
					: never]: K extends string
					? T[K] extends ReadonlyArray<infer U> // Se for array...
						? IsExpandableUnion<U> extends false
							? ReadonlyArray<
									ExpandAll<
										U,
										Extract<ExpandRemaindersFor<K, E>, GenerateExpandPaths<U>>
									>
								>
							: ReadonlyArray<
									ExpandRemaindersFor<K, E> extends never
										? Extract<U, string>
										: Exclude<U, string>
								>
						: T[K] extends object
							? ExpandAll<
									T[K],
									Extract<ExpandRemaindersFor<K, E>, GenerateExpandPaths<T[K]>>
								>
							: ExpandRemaindersFor<K, E> extends never
								? Extract<T[K], string>
								: ExpandAll<
										Exclude<T[K], string>,
										Extract<
											ExpandRemaindersFor<K, E>,
											GenerateExpandPaths<Exclude<T[K], string>>
										>
									>
					: never;
			}
		>;
// Some test types for debugging purposes
type _ = GenerateExpandPaths<PrefixMap["prod"]>;
type __ = ExpandAll<PrefixMap["prod"], "workspaceId">;
type ___ = GenerateExpandPaths<PrefixMap["prod"][]>;
type ____ = ExpandAll<PrefixMap["prod"][], never>;
type _____ = ExpandAll<{ prod: PrefixMap["prod"] }, "prod.workspaceId">;
type ______ = ExpandAll<
	{ prod: PrefixMap["prod"] | "prod_ee" },
	"prod.workspaceId.ownerId"
>;
type _______ = GenerateExpandPaths<{
	wosp: PrefixMap["prod"]["workspaceId"][];
}>;
type ________ = KeyMatchesExpand<"wosp", _______>;

// Validators

export function convertExpandPathToPointers(
	responseBody: any,
	expand: string[],
): string[] {
	if (Array.isArray(responseBody)) {
		return responseBody.flatMap((b, i) =>
			convertExpandPathToPointers(b, expand).map(p => `/${i}${p}`),
		);
	}
	const valuesToExpand: string[] = [];

	for (const pointer of expand) {
		const values = pointer.split(".").reduce(
			(pathJsonPointers: string[], childKey: string) => {
				const childrenValues: string[] = [];

				for (const parentPath of pathJsonPointers) {
					const parentValue =
						parentPath === ""
							? responseBody
							: getPointerValue(responseBody, parentPath);

					if (
						parentValue &&
						(typeof parentValue === "object" || typeof parentValue === "string")
					) {
						const convertedJsonPointer = `${parentPath}/${childKey}`;
						const pointerValue = getPointerValue(
							responseBody,
							convertedJsonPointer,
						);

						if (Array.isArray(pointerValue)) {
							for (let i = 0; i < pointerValue.length; i++) {
								childrenValues.push(`${parentPath}/${childKey}/${i}`);
							}
						} else {
							childrenValues.push(convertedJsonPointer);
						}
					} else if (Array.isArray(parentValue)) {
						for (let i = 0; i < parentValue.length; i++) {
							childrenValues.push(`${parentPath}/${i}/${childKey}`);
						}
					}
				}

				return childrenValues;
			},
			[""],
		);

		valuesToExpand.push(...values);
	}

	return valuesToExpand.filter(
		v => typeof getPointerValue(responseBody, v) === "string",
	);
}

export function getPointerValue(obj: any, path: string): unknown {
	const parts = path.split("/").filter(Boolean);
	let result = obj;

	for (const part of parts) {
		if (typeof result !== "object" || result == null) {
			return undefined;
		}
		result = result[part];
	}

	return result;
}

export function expandSchema<
	A,
	I,
	R,
	ExpandStrings extends GenerateExpandPaths<A>[] = [],
>(schema: Schema.Schema<A, I, R>, expandStrings: ExpandStrings) {
	return Schema.filter(value => {
		const expandPaths = convertExpandPathToPointers(value, expandStrings);
		const allPathsContainObjects = expandPaths.every(path => {
			const pointerValue = getPointerValue(value, path);
			return typeof pointerValue === "object" && pointerValue !== null;
		});
		return allPathsContainObjects;
	})(schema) as Schema.Schema<
		ExpandAll<A, tf.TupleToUnion<ExpandStrings>>,
		I,
		R
	>;
}
