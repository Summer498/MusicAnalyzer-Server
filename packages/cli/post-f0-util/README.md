# Post F0 Utility

Reusable utility functions for frequency post‑processing used by the other CLI tools.

## Exports

- **getBandpassFrequency(freq_median_filtered: number[])**
  - Filters out values outside of a fixed frequency range using `bandpass`.
- **getFreqFromPhase(frequency: number[])**
  - Converts an instantaneous frequency array into accumulated phase values.
- **getFrequency(freq: number[], N: number)**
  - Resamples frequency data to match a desired sampling rate.
- **getWav(src: number[], SAMPLING_RATE: number)**
  - Generates a WAV file buffer from raw sample values using `wavefile`.
- **freq2midi(freq: number)**
  - Converts a frequency in Hz to its corresponding MIDI note number.
- **roundOnMIDI(freq: number)**
  - Rounds a frequency to the nearest semitone and converts back to Hz.

Internal helpers used in `src/util` include simple band‑pass checking and conversions between MIDI and frequency.
