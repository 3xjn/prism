declare const __DEV__: boolean | undefined;

const RunService = game.GetService("RunService");

let cachedDevMode: boolean | undefined;

/**
 * Whether Prism should run in strict development mode.
 *
 * Dev mode makes token misuse loud: invalid tokens throw instead of
 * warning and falling back. Defaults to `RunService:IsStudio()`, so
 * development in Studio is strict and live servers stay lenient.
 * Setting `_G.__DEV__` to a boolean before Prism first loads overrides
 * the default in either direction.
 */
export function isDevMode(): boolean {
	if (cachedDevMode === undefined) {
		cachedDevMode = __DEV__ === undefined ? RunService.IsStudio() : __DEV__ === true;
	}

	return cachedDevMode;
}
