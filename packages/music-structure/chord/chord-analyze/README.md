# @music-analyzer/chord-analyze

Tools for estimating chord progressions and roman numerals.

## Main exports

- `calcChordProgression(chords)` – analyze a sequence of `TimeAndChordSymbol` and return `SerializedTimeAndRomanAnalysis` entries.
- `TimeAndChordSymbol` – time-stamped chord symbol representation.
- `SerializedTimeAndRomanAnalysis` – single chord analysis with roman numeral and scale information.
- `SerializedRomanAnalysisData` – container for arrays of serialized analyses.

These helpers rely on tonal information from `@music-analyzer/roman-chord` and other utility packages.
