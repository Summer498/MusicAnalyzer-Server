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
**Note for new contributors**: Run `yarn install` (or `npm install`) before using `tsc` or running the tests. Running `yarn` creates a `yarn.lock` file for repeatable installs.

### Creating utility instances

Some CLI utilities expose factory functions rather than classes. For example,
the median filter used in post-processing is constructed with
`createMedianFilter()`:

```ts
import { createMedianFilter } from "@music-analyzer/post-pyin";
const filter = createMedianFilter(25);
```

This pattern replaces the previous `new MedianFilter()` usage and helps remove
class declarations from the codebase.

Other helpers now expose factory functions as well. For instance:

```ts
import { createAssertion, createNotImplementedError } from "@music-analyzer/stdlib";
createAssertion(x > 0).onFailed(() => { throw createNotImplementedError(); });
```

UI registries are instantiated in the same way:

```ts
import { createAudioReflectableRegistry, createWindowReflectableRegistry } from "@music-analyzer/view";
const audioReg = createAudioReflectableRegistry();
const windowReg = createWindowReflectableRegistry();
```

Color selector controllers are now created via factories as well:

```ts
import { createMelodyColorController } from "@music-analyzer/controllers";
const colorCtrl = createMelodyColorController();
```

Time ranges and FFT helpers follow the same pattern:

```ts
import { createTime } from "@music-analyzer/time-and";
import { createRootOfUnity } from "@music-analyzer/math";
const time = createTime(0, 1);
const roots = createRootOfUnity();
```

A helper for working with analyzed melody data now follows the same pattern:

```ts
import { createSerializedTimeAndAnalyzedMelodyAndIR } from "@music-analyzer/melody-hierarchical-analysis";
const entry = createSerializedTimeAndAnalyzedMelodyAndIR(melody, "I");
```
