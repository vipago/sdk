import { Schema } from "effect";
// Isto vem do formato do tanstack table pra não precisar de converter o formato do tanstack pra api
// assim dá pra enviar o sortingState direto da tabela no frontend
export const SortingStateSchema = Schema.Array(
	Schema.Struct({
		id: Schema.String,
		desc: Schema.Boolean,
	}),
);
export type SortingState = typeof SortingStateSchema.Type;
