import { Complex, correlation } from "@music-analyzer/math";
import { AudioReflectable } from "@music-analyzer/view";

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

export class WaveViewer implements AudioReflectable {
  private readonly path: SVGPathElement;
  private old_wave: Complex<number>[];
  readonly svg: SVGSVGElement;
  constructor(
    private readonly analyser: AudioAnalyzer,
  ) {
    this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.path.setAttribute("stroke", "blue");
    this.path.setAttribute("fill", "none");
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.appendChild(this.path);
    this.svg.id = "sound-wave";
    this.svg.setAttribute("width", String(800));
    this.svg.setAttribute("height", String(450));
    this.old_wave = [... new Array(analyser.analyser.fftSize)].map(e => new Complex(0, 0));
  }

  private getDelay(copy:Complex<number>[]){
    const col = correlation(this.old_wave, copy);

    let delay = 0;
    for (let i = 0; i < col.length / 2; i++) {
      if (col[delay].re < col[i].re) {
        delay = i;
      }
    }
    for (let i = 0; i < copy.length; i++) {
      this.old_wave[i] = copy[(i + delay) % copy.length];
    }
    return delay;    
  }

  onAudioUpdate() {
    const wave = this.analyser.getByteTimeDomainData();
    const width = this.svg.clientWidth;
    const height = this.svg.clientHeight;
    let path_data = "";

    const copy: Complex<number>[] = [];
    wave.forEach(e => { copy.push(new Complex(e, 0)); });
    const delay = this.getDelay(copy);

    for (let i = 0; i < wave.length / 2; i++) {
      if (isNaN(wave[i + delay] * 0)) { continue; }
      const x = i * 2 / (wave.length - 1) * width;
      // データは [0,255] なので, 中心を height/2 として正規化
      const y = wave[i + delay] / 255 * height;
      path_data += `L ${x},${y}`;
    }
    this.path.setAttribute("d", "M" + path_data.slice(1));
  }
}

export class spectrogramViewer implements AudioReflectable {
  private readonly path: SVGPathElement;
  readonly svg: SVGSVGElement;
  constructor(
    private readonly analyser: AudioAnalyzer,
  ) {
    this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.path.setAttribute("stroke", "red");
    this.path.setAttribute("fill", "none");
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.appendChild(this.path);
    this.svg.id = "spectrum";
    this.svg.setAttribute("width", String(800));
    this.svg.setAttribute("height", String(450));
  }

  onAudioUpdate() {
    const freqData = this.analyser.getByteFrequencyData();
    const fftSize = freqData.length;
    const width = this.svg.clientWidth;
    const height = this.svg.clientHeight;
    let pathData = "";

    for (let i = 0; i < fftSize; i++) {
      if (isNaN(freqData[i] * 0)) { continue; }
      const x = i / (fftSize - 1) * width;
      const y = (1 - freqData[i] / 255) * height;
      // const y = (1 - Math.log2(1 + freqData[i]) / 8) * height;
      pathData += `L ${x},${y}`;
    }
    this.path.setAttribute("d", "M" + pathData.slice(1));
  }
}

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
