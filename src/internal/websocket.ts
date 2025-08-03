import { Chunk, Effect, Option, Stream } from "effect";
import { NetworkError } from "../error";

export const createEffectWebsocket = Effect.fn("createEffectWebsocket")(
	function* (url: string) {
		yield* Effect.logInfo("Connecting websocket to url: " + url);
		const ws = new WebSocket(url);
		yield* Effect.async<void, NetworkError>(resolve => {
			ws.addEventListener("open", () => resolve(Effect.void));
			ws.addEventListener("error", () =>
				resolve(Effect.fail(new NetworkError())),
			);
		});
		yield* Effect.logInfo("Connected to " + url);

		yield* Effect.addFinalizer(() =>
			Effect.sync(() => ws.readyState < 2 && ws.close()),
		);
		const serverPacketStream = yield* Stream.async<string, Event>(emit => {
			ws.addEventListener("message", msg => {
				if (typeof msg.data === "string") {
					emit(Effect.succeed(Chunk.make(msg.data)));
				}
			});
			ws.addEventListener("close", () => {
				emit(Effect.fail(Option.none()));
			});
			ws.addEventListener("error", e => {
				emit(Effect.fail(Option.some(e)));
			});
		}).pipe(
			Stream.tapError(e => Effect.logError("Websocket error: " + e)),
			Stream.share({
				capacity: "unbounded",
			}),
		);
		return { ws, serverPacketStream };
	},
);
