# @music-analyzer/tonal-objects

Utility wrappers around [@tonaljs](https://github.com/tonaljs/tonal) functions. These helpers provide convenient typed
interfaces for common tonal operations used across this monorepo.

## Public utility functions

| Function | Description | Return value |
| --- | --- | --- |
| `getInterval(src, dst)` | Wrapper of `@tonaljs/interval.get`. Calculates the interval between two notes. | `Interval` object describing the interval. |
| `intervalOf(src, dst)` | Wrapper of `@tonaljs/interval.distance`. Returns interval name between notes. | string literal of the interval name. |
| `getIntervalDegree(src, dst)` | Returns numeric degree of the interval between two notes. | number (1 for unison, 2 for second, ...). |
| `getSemitones(interval)` | Wrapper of `@tonaljs/interval.semitones`. | number of semitones in the interval. |
| `getChord(name)` | Wrapper of `@tonaljs/chord.get`. Parses a chord name. | `Chord` object with chord details. |
| `getNote(name)` | Wrapper of `@tonaljs/note.get`. Parses a note string. | `Note` object. |
| `getChroma(name)` | Wrapper of `@tonaljs/note.chroma`. | chroma number (0-11). |
| `chromaFromNonNull(note)` | Safe version of `getChroma` for nullable input. | chroma number. |
| `noteFromMidi(midi)` | Wrapper of `@tonaljs/note.fromMidi`. Converts MIDI number to note. | `Note` object. |
| `majorKey(tonic)` | Wrapper of `@tonaljs/key.majorKey`. | Key object describing major scale. |
| `minorKey(tonic)` | Wrapper of `@tonaljs/key.minorKey`. | Key object describing minor scale. |
| `getRomanNumeral(numeral)` | Wrapper of `@tonaljs/roman-numeral.get`. | object with roman numeral analysis. |
| `getScale(name)` | Wrapper of `@tonaljs/scale.get`. | `Scale` object describing the scale. |

All these functions are re-exported from the package root so they can be imported as:

```ts
import { getChord, getInterval } from '@music-analyzer/tonal-objects';
```

## Internal files

The `src/` directory only contains thin wrappers around `@tonaljs` packages. There are currently no private helper
functions—every file exposes its functionality via exports.
