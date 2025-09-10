import { Schema } from "effect";
export const DateMaybeFromString = Schema.Union(
	Schema.DateFromString,
	Schema.DateFromSelf,
).annotations({
	...Schema.DateFromString.ast.annotations,
	jsonSchema: {
		type: "string",
		format: "date-time",
	},
});
