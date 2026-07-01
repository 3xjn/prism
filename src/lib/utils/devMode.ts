const RunService = game.GetService("RunService");

const devOverride = (_G as { __DEV__?: unknown }).__DEV__;

const devMode = devOverride === undefined ? RunService.IsStudio() : devOverride === true;

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
	return devMode;
}
