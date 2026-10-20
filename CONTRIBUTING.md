# Contributing to Prism

## Setup

Install Node.js 24.12 or newer, [Rokit](https://github.com/rojo-rbx/rokit), and Roblox Studio.

```sh
npm ci
rokit install
npm run build
rojo serve
```

Connect Studio to Rojo to open the playground. Component stories live in `src/playground/stories` and use [UI Labs](https://ui-labs.luau.page/).

## Commands

| Command                      | Purpose                                          |
| ---------------------------- | ------------------------------------------------ |
| `npm run build`              | Compile the playground and tests                 |
| `npm run build:package`      | Compile the npm library into `out/lib`           |
| `npm run build:bindings`     | Build the Luau package and Studio model          |
| `npm run package:bindings`   | Build the model and Wally source archive         |
| `npm run typecheck`          | Check library and build-script types             |
| `npm run lint`               | Lint library source                              |
| `npm run format`             | Check formatting                                 |
| `npm run verify:package`     | Check npm package contents                       |
| `npm run typecheck:bindings` | Check Luau declarations and the consumer example |
| `npm test`                   | Run tests in a Roblox DataModel                  |

Generated `out/` and `dist/` directories are gitignored. The npm `prepack` script builds `out/lib` automatically.

## Luau bindings

```sh
npm run package:bindings
```

This uses rbxtsc to compile the library, Rojo to build `dist/Prism.rbxm`, and Wally to create `dist/prism-bindings.zip`. The source package is in `dist/bindings`.

These commands build local artifacts; they do not publish to a registry. CI uploads both the model and archive as `prism-bindings`.

### How it works

`scripts/package-bindings.ts` stages the compiled library, binding files, and runtime dependencies reported by `npm ls --omit=dev`. It also includes dependency licenses. It runs directly on Node.js; `tsconfig.scripts.json` checks its types.

`bindings/init.luau` exposes the components and public types. Maintain `bindings/types.luau` alongside changes to TypeScript props, themes, and callbacks. The declarations are checked in and require no generation step.

All components use the bundled React runtime. Keep its dependency graph together when changing the package layout. `mountPrism` remains a legacy npm export.

### Checks

CI calls Rojo and luau-lsp directly to check the binding declarations and `bindings/examples/Preferences.luau`. To run the same check locally after building:

```sh
curl --fail --location https://raw.githubusercontent.com/JohnnyMorganz/luau-lsp/5c14dad8d4e82357074e5553244d3621797ff876/scripts/globalTypes.d.luau --output dist/robloxTypes.d.luau
npm run typecheck:bindings
```

Inspect rendering and interactions separately in Studio.

## Runtime tests

`npm test` runs `@rbxts/jest` through `@isentinel/jest-roblox` in a Roblox DataModel. Locally it uses a connected Studio plugin when available, otherwise Roblox Open Cloud.

For Open Cloud, set:

| Variable                    | Purpose                                                 |
| --------------------------- | ------------------------------------------------------- |
| `ROBLOX_OPEN_CLOUD_API_KEY` | API key with place-write and Luau-execution permissions |
| `ROBLOX_UNIVERSE_ID`        | Universe containing the test place                      |
| `ROBLOX_PLACE_ID`           | Place to publish and execute tests in                   |

`JEST_`-prefixed versions of these variables take precedence. The API key needs `universe-places:write` and `universe.place.luau-execution-session:write`. Use a dedicated test place: this runner publishes to it.

CI runs runtime tests when the Open Cloud secret is configured. Type checking, linting, building, and package checks run independently.

Files named `__typecheck__.tsx` are compile-time checks. Overlay tests use a `ScreenGui` with `ZIndexBehavior.Sibling`.
