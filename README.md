# MusicAnalyzer Server

This repository hosts a Yarn workspace containing the MusicAnalyzer server and a
collection of packages for music analysis.  The workspace layout is driven by
**packages/**, where each subdirectory is an independent TypeScript package
built with `tsup`.  Packages contain libraries for tonal analysis, utilities and
CLI tools.

## packages/ workspace

- **packages/** – root of all internal packages.
  - `UI/` – UI utilities and components.
  - `cli/` – Command line tools such as `chord-analyze-cli` and
    `melody-analyze-cli`.  These consume the library packages to perform tasks
    like chord and melody analysis.
  - `cognitive-theory-of-music/`, `music-structure/`, `tonal-objects/`, `util/`
    – libraries providing music theory primitives used across the project.

Each subpackage has its own `package.json` and build scripts.  Running `yarn
build` at the repo root invokes Turbo to build all of them.

## ServerProgram

The server entry point lives in `ServerProgram/index.ts`.  It starts an Express
HTTP server that exposes endpoints for uploading audio, listing analysis files
and serving processed results.  When running `yarn start` the root `package.json`
launches this file with `node ServerProgram`.

## CLI tools

The CLI utilities under `packages/cli/` depend on the core library packages.
They are built with `tsup` and can be used to process audio data or perform
analysis from the command line.  For instance, `melody-analyze-cli` reads melody
and roman–numeral data and outputs analysis results.

## Building and testing

1. Install dependencies: `yarn install`
2. Build all packages: `yarn build`
3. Run the test suite: `yarn test`
4. Start the development server: `yarn start`

These commands operate from the repository root and leverage the Yarn workspace
configuration.
