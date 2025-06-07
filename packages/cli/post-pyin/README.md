# Post pYIN CLI

Processes pitch estimation results from [pYIN](https://github.com/librosa/librosa/). The script converts JSON output from pYIN into cleaned frequency data and diagnostic files.

## index.ts

- **main(argv: string[])**
  - Loads a pYIN JSON file and obtains its `f0` sequence.
  - Applies octave correction, rounding on MIDI, median filtering (`getMedianFrequency`) and band‑pass filtering.
  - Generates frequency arrays for audio confirmation and delegates file writing to `postProcess`.
- **postProcess(dir, SAMPLING_RATE, freq_band_passed, frequency)**
  - Writes filtered frequencies, MIDI values and sine‑wave audio into the given directory.

## src/

- **getMedianFrequency(freq_rounded: (number | null)[])**
  - Uses `MedianFilter` to remove spikes and resets the buffer when null values are encountered.
- **MedianFilter class**
  - Holds a ring buffer and returns the median of the most recent values.
- **Vocals type**
  - Describes the structure of pYIN output JSON.

This CLI mirrors the flow of `post-crepe` but handles pYIN's JSON format and null values.
