# Spectrogram Components

This package visualizes audio data using the Web Audio API.

- **AudioViewer** connects an `HTMLMediaElement` with three viewers: `WaveViewer`,
  `spectrogramViewer`, and `FFTViewer`.
- **wave-viewer.ts** draws the waveform of the current audio buffer.
- **spectrogram-viewer.ts** renders a scrolling frequency spectrogram.
- **fft-viewer.ts** shows the instantaneous FFT result.

These viewers update in real time when the audio registry notifies them of new data.
