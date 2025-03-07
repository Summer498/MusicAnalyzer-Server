import { AudioReflectable } from "@music-analyzer/view";
import { WaveViewer } from "./wave-viewer";
import { spectrogramViewer } from "./spectrogram-viewer";
import { AudioAnalyzer } from "./audio-analyzer";

// AudioAnalyzer.ts
export class AudioViewer implements AudioReflectable {
  readonly wave: WaveViewer;
  readonly spectrogram: spectrogramViewer;

  constructor(
    private readonly audio_element: HTMLMediaElement,
  ) {
    const analyser = new AudioAnalyzer(this.audio_element);
    this.wave = new WaveViewer(analyser);
    this.spectrogram = new spectrogramViewer(analyser);
  }
  onAudioUpdate() {
    this.wave.onAudioUpdate();
    this.spectrogram.onAudioUpdate();
  }
}
