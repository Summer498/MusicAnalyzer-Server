# Pull Request Conflict Resolution Tasks

The GitHub repository contains several open PR branches that cannot merge cleanly into `main`. Each branch must be rebased or merged with `main` and the conflicts fixed. After resolving conflicts, run the project tests and update the PR.

## Tasks by Branch

- **codex/refactor-spectrogram-classes-to-interfaces** (#77)
  - Rebase onto latest `main`.
  - Resolve TypeScript and asset merge conflicts in `packages/UI/spectrogram`.
  - Run `yarn build` and `yarn test` to ensure spectrogram utilities pass.
- **codex/replace-classes-with-interface-factories** (#69)
  - Rebase onto `main` and fix conflicts within `packages/UI/piano-roll`.
  - Verify updated factory functions in `melody-view` and `chord-view` compile.
  - Run the CLI and UI test suites.
- **codex/convert-beatbar-classes-to-interfaces** (#66)
  - Merge latest `main` into the branch.
  - Address conflicts in `beat-view` components and adjust exports.
  - Confirm `packages/UI/piano-roll/beat-view` tests succeed.
- **codex/refactor-color-selector-classes-into-interfaces** (#65)
  - Rebase with `main` and resolve `color-selector` controller conflicts.
  - Update any imports using the old class-based API.
  - Execute unit tests for the color selector module.
- **codex/refactor-slider.ts-classes-to-interfaces-and-factories** (#63)
  - Integrate latest `main`, fixing conflicts in slider controllers.
  - Ensure the slider utilities compile after interface changes.
  - Run affected UI tests.
- **codex/convert-classes-to-interfaces-and-update-exports** (#62)
  - Rebase onto `main` and fix conflicts across switcher controllers.
  - Update barrel exports in `packages/UI/controllers`.
  - Validate build and tests.
- **o7s3ej-codex/refactor-controller-classes-to-interfaces-and-factories** (#61)
  - Merge `main` and resolve controller base conflicts.
  - Ensure new factories are exported correctly.
  - Run project-wide tests.
- **codex/refactor-controller-classes-to-interfaces-and-factories** (#60)
  - Rebase with `main`, handling the remaining controller refactors.
  - Double-check cross-package imports after the refactor.
  - Run `yarn test` to verify all packages build and pass.

