import { AudioReflectable, AudioReflectableRegistry } from "@music-analyzer/view";
import { WaveViewer } from "./wave-viewer";
import { spectrogramViewer } from "./spectrogram-viewer";
import { AudioAnalyzer } from "./audio-analyzer";
import { FFTViewer } from "./fft-viewer";

// AudioAnalyzer.ts
export class AudioViewer implements AudioReflectable {
  readonly wave: WaveViewer;
  readonly spectrogram: spectrogramViewer;
  readonly fft: FFTViewer;

  constructor(
    private readonly audio_element: HTMLMediaElement,
    publisher: AudioReflectableRegistry
  ) {
    const analyser = new AudioAnalyzer(this.audio_element);
    this.wave = new WaveViewer(analyser);
    this.spectrogram = new spectrogramViewer(analyser);
    this.fft = new FFTViewer(analyser)
    publisher.register(this);
  }
  onAudioUpdate() {
    this.wave.onAudioUpdate();
    this.spectrogram.onAudioUpdate();
    this.fft.onAudioUpdate();
  }
}
