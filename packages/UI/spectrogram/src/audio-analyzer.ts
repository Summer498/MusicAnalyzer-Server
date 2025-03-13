export class AudioAnalyzer {
  private readonly audioCtx: AudioContext;
  private readonly source: MediaElementAudioSourceNode;
  readonly analyser: AnalyserNode;

  // 設定可能なパラメータ
  private readonly waveformWindowSec: number = 1 / 60; // デフォルト: 1/60秒
  private readonly spectrogramWindowSamples: number = 1024; // デフォルト: 1024サンプル
  // コサイン窓
  private cosineWindow = (e: number, i: number, arr: number[]) => {
    const N = arr.length;
    return e * Math.sin(Math.PI * i / (N - 1));
  };

  // STFT や CQT の保存用
  private readonly stftData: number[][] = [];
  private cqtData: number[][] = [];

  constructor(audioElement: HTMLAudioElement) {
    this.audioCtx = new AudioContext();
    this.source = this.audioCtx.createMediaElementSource(audioElement);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;

    audioElement.addEventListener("play", () => {
      this.audioCtx.state === 'suspended' ? this.audioCtx.resume() : undefined;
    });

    this.source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
  }

  getByteTimeDomainData() {
    const buffer_length = this.analyser.fftSize;
    const buffer = new Uint8Array(buffer_length);
    this.analyser.getByteTimeDomainData(buffer);
    return buffer;
  }

  getByteFrequencyData() {
    const frequency_bin_count = this.analyser.frequencyBinCount;
    const buffer = new Uint8Array(frequency_bin_count);
    this.analyser.getByteFrequencyData(buffer);
    return buffer;
  }
}
