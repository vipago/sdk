import { Schema } from "effect";

/**
 * Preferências para escolha de gateway para um método de pagamento em uma workspace.
 */
export const GatewayStrategySchema = Schema.Literal(
	"weighted_random",
	"random",
	"first",
);

export const WorkspaceGatewayPreferencesSchema = Schema.Struct({
	priority: Schema.Array(Schema.String).pipe(Schema.optional),
	fallback: Schema.Boolean.pipe(Schema.optional),
	limits: Schema.Record({
		key: Schema.String,
		value: Schema.Number,
	}).pipe(Schema.optional),
	working_hours: Schema.Record({
		key: Schema.String,
		value: Schema.Array(
			Schema.String.pipe(
				Schema.pattern(/^\d{2}:\d{2}-\d{2}:\d{2}$/),
				Schema.transform(
					Schema.Struct({
						start: Schema.Int,
						end: Schema.Int,
					}),
					{
						strict: true,
						decode: (encodedString: string) => {
							// Exemplo: "08:10-17:30"
							const match = encodedString.match(
								/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/,
							);
							if (!match) {
								throw new Error(
									"Formato inválido para working_hours: " + encodedString,
								);
							}
							const [, startHour, startMinute, endHour, endMinute] = match;
							const start =
								Number.parseInt(startHour, 10) * 60 +
								Number.parseInt(startMinute, 10);
							const end =
								Number.parseInt(endHour, 10) * 60 +
								Number.parseInt(endMinute, 10);
							return { start, end };
						},
						encode: decodedObject => {
							const toHHMM = (minutes: number) => {
								const hour = Math.floor(minutes / 60);
								const min = minutes % 60;
								return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
							};
							return `${toHHMM(decodedObject.start)}-${toHHMM(decodedObject.end)}`;
						},
					},
				),
			),
		),
	}).pipe(Schema.optional),
	strategy: GatewayStrategySchema,
});

export type WorkspaceGatewayPreferences =
	typeof WorkspaceGatewayPreferencesSchema.Type;
