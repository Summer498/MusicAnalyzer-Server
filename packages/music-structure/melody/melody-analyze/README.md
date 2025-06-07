# @music-analyzer/melody-analyze

This package provides utilities to analyze monophonic melodies.

## Main exports

- `analyzeMelody(melodies, romans)` – returns `SerializedTimeAndAnalyzedMelody[]` representing analysis results for each note.
- `SerializedMelodyAnalysisData` – container class for serialized melody analysis results with version check helpers.
- `getTimeAndMelody(melody_data, sampling_rate)` – converts raw pitch sequence into `TimeAndMelody` objects.
- `TimeAndMelody`, `SerializedTimeAndAnalyzedMelody` – data classes used in analysis.

Use these helpers to combine melodic lines with chord analysis data from `@music-analyzer/chord-analyze`.
