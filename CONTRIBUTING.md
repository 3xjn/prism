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

| Command                  | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `npm run build`          | Compile the playground and tests                 |
| `npm run build:package`  | Compile the npm library into `out/lib`           |
| `npm run build:native`   | Build the native source package in `dist/native` |
| `npm run typecheck`      | Check library and build-script types             |
| `npm run lint`           | Lint library source                              |
| `npm run format`         | Check formatting                                 |
| `npm run verify:package` | Check npm package contents                       |
| `npm run verify:native`  | Check and package native Luau output             |
| `npm test`               | Run tests in a Roblox DataModel                  |

Generated `out/` and `dist/` directories are gitignored. The npm `prepack` script builds `out/lib` automatically.

## Native package

```sh
npm run build:native
rojo build dist/native/default.project.json -o dist/Prism.rbxm
```

`dist/native` contains the source package and a Wally manifest. To create its archive:

```sh
cd dist/native
wally package --output ../prism-native.zip
```

These commands build local artifacts; they do not publish to a registry. CI runs `npm run verify:native` and uploads both the model and archive as `prism-native`.

### How it works

The scripts in `scripts/*.ts` run directly on Node.js. `tsconfig.scripts.json` checks them separately from the Roblox source.

`build-native.ts` copies Prism's compiled components and the React dependency graph from the lockfile. `native-types.ts` uses the TypeScript compiler API to generate public Luau types. The hand-written entry modules live in `native/`.

All native components use the bundled React runtime. Keep its dependency graph together when changing the package layout. The native API uses direct React component composition; `mountPrism` remains a legacy npm export.

### Checks

`verify-native.ts` checks component exports, generated types, source parity, and dependency versions. It compiles Luau with Lune, checks positive and negative type fixtures with luau-lsp, then builds the Rojo model and Wally archive. Roblox definitions are downloaded from a pinned luau-lsp revision and cached in `dist`.

The consumer example is `native/examples/Preferences.luau`. Package checks cover syntax, types, and packaging; inspect rendering and interactions separately in Studio.

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
