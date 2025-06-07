# @music-analyzer/melody-hierarchical-analysis

Provides hierarchical reduction utilities built on `@music-analyzer/melody-analyze`.

## Main exports

- `getHierarchicalMelody(measure, reduction, matrix, musicxml, roman)` –
  returns layered melody analysis for GTTM reductions.
- `getTimeAndMelody(element, matrix, musicxml)` – helper for converting
  reduction elements into `TimeAndMelody` objects.

The package expects reduction data from `@music-analyzer/gttm` and chord
analysis from `@music-analyzer/chord-analyze`.
