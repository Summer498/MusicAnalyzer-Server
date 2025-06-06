import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WaveViewer, createWaveViewer } from "./wave-viewer";
import { SpectrogramViewer, createSpectrogramViewer } from "./spectrogram-viewer";
import { AudioAnalyzer, createAudioAnalyzer } from "./audio-analyzer";
import { FFTViewer, createFFTViewer } from "./fft-viewer";

// AudioAnalyzer.ts
export interface AudioViewer {
  readonly wave: WaveViewer;
  readonly spectrogram: SpectrogramViewer;
  readonly fft: FFTViewer;
  onAudioUpdate(): void;
}

export const createAudioViewer = (
  audio_element: HTMLMediaElement,
  audio_registry: AudioReflectableRegistry,
): AudioViewer => {
  const analyser = createAudioAnalyzer(audio_element);
  const wave = createWaveViewer(analyser);
  const spectrogram = createSpectrogramViewer(analyser);
  const fft = createFFTViewer(analyser);
  const onAudioUpdate = () => {
    wave.onAudioUpdate();
    spectrogram.onAudioUpdate();
    fft.onAudioUpdate();
  };
  audio_registry.addListeners(onAudioUpdate);
  return { wave, spectrogram, fft, onAudioUpdate };
};
