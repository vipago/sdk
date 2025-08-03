import * as cookie from "cookie";
import {
	ConfigProvider,
	ConfigProviderPathPatch,
	Effect,
	HashSet,
	Option,
} from "effect";
import * as Arr from "effect/Array";
import * as configError from "effect/ConfigError";
import { pipe } from "effect/Function";

// Isto apenas copiei e colei do fromEnv do effect mas mudei pra puxar dos cookies
function createCookiesConfigProvider(): ConfigProvider.ConfigProvider {
	const pathDelim = "_";

	return ConfigProvider.fromFlat(
		ConfigProvider.makeFlat({
			load(path, primitive) {
				const pathString = path.join(pathDelim);
				const cookies = cookie.parse(document.cookie);
				const valueOpt =
					pathString in cookies
						? Option.some(cookies[pathString]!)
						: Option.none();

				return pipe(
					valueOpt,
					Effect.mapError(() =>
						configError.MissingData(
							path as string[],
							`Expected ${pathString} to exist in the cookies`,
						),
					),
					Effect.flatMap(value =>
						pipe(
							primitive.parse(value),
							Effect.mapBoth({
								onFailure: configError.prefixed(path as string[]),
								onSuccess: Arr.of,
							}),
						),
					),
				);
			},

			enumerateChildren(path) {
				return Effect.sync(() => {
					const cookies = cookie.parse(document.cookie);
					const keys = Object.keys(cookies);
					const keyPaths = keys.map(key => key.toUpperCase().split(pathDelim));

					const filtered = keyPaths
						.filter(keyPath =>
							path.every((part, i) => keyPath[i] === part.toUpperCase()),
						)
						.flatMap(keyPath => keyPath.slice(path.length, path.length + 1));

					return HashSet.fromIterable(filtered);
				});
			},

			patch: ConfigProviderPathPatch.empty,
		}),
	);
}

/**
 * Provedor de configuração que puxa as configurações apartir dos cookies
 * É utilizado primariamente pela dashboard da vipago para usar o ID de sessão guardado nos cookies como chave de API
 */
export const COOKIES_CONFIG_PROVIDER: ConfigProvider.ConfigProvider =
	createCookiesConfigProvider();

// Fazer monkey patch do ambiente no navegador para permitir o effect puxar variaveis de ambiente do vite como se fosse o node
if (globalThis.process?.env === undefined) {
	// @ts-ignore
	globalThis.process = { env: import.meta.env };
}

/**
 * Provedor de configuração que puxa as configurações apartir das variaveis de ambiente do vite
 *
 * O vite expõe as variáveis de ambiente que começam com `VITE_` para o frontend acessar, então
 * este `ConfigProvider` remove o prefixo `VITE_` antes de usar
 */
export const VITE_ENV_CONFIG_PROVIDER = ConfigProvider.fromEnv().pipe(
	ConfigProvider.nested("VITE"),
);

/**
 * Tenta usar o `COOKIES_CONFIG_PROVIDER` ou puxa do `VITE_ENV_CONFIG_PROVIDER` se não existir
 */
export const VITE_ENV_COOKIES_FALLBACK_CONFIG_PROVIDER =
	COOKIES_CONFIG_PROVIDER.pipe(
		ConfigProvider.orElse(() => VITE_ENV_CONFIG_PROVIDER),
	);

export { ConfigProvider };
