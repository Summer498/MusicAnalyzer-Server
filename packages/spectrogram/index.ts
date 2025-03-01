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

    this.analyser.connect(this.audioCtx.destination);
    this.source.connect(this.analyser);
  }

  getByteTimeDomainData() {
    const buffer_length = this.analyser.fftSize;
    const data_array = new Uint8Array(buffer_length);
    this.analyser.getByteTimeDomainData(data_array);
    return data_array;
  }

  getFloatFrequencyData() {
    const fft_size = this.analyser.frequencyBinCount;
    const freq_data = new Float32Array(fft_size);
    this.analyser.getFloatFrequencyData(freq_data);
    return freq_data;
  }
}

export class WaveViewer {
  private readonly waveformPath: SVGPathElement;
  constructor(
    private readonly analyser: AudioAnalyzer,
    private readonly waveformSVG: SVGSVGElement,
  ) {
    this.waveformPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.waveformPath.setAttribute("stroke", "blue");
    this.waveformPath.setAttribute("fill", "none");
    this.waveformSVG.appendChild(this.waveformPath);
  }

  drawWaveform() {
    const wave = this.analyser.getByteTimeDomainData();
    const width = this.waveformSVG.clientWidth;
    const height = this.waveformSVG.clientHeight;
    let pathData = "";

    for (let i = 0; i < wave.length; i++) {
      const x = i / (wave.length - 1) * width;
      // データは [0,255] なので、中心を height/2 として正規化
      const y = wave[i] / 255 * height;
      pathData += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
    }
    this.waveformPath.setAttribute("d", pathData);
  }
}

export class spectrogramViewer {
  private readonly spectrogramPath: SVGPathElement;
  constructor(
    private readonly analyser: AudioAnalyzer,
    private readonly spectrogramSVG: SVGSVGElement,
  ) {
    this.spectrogramPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.spectrogramPath.setAttribute("stroke", "red");
    this.spectrogramPath.setAttribute("fill", "none");
    this.spectrogramSVG.appendChild(this.spectrogramPath);
  }

  drawSpectrogram() {
    const freqData = this.analyser.getFloatFrequencyData();
    const fftSize = freqData.length;
    const width = this.spectrogramSVG.clientWidth;
    const height = this.spectrogramSVG.clientHeight;
    let pathData = "";

    for (let i = 0; i < fftSize; i++) {
      const x = i / (fftSize - 1) * width;
      const y = height - freqData[i] * height;
      pathData += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
    }
    this.spectrogramPath.setAttribute("d", pathData);
  }
}

// AudioAnalyzer.ts
export class AudioViewer {
  private readonly wave_viewer: WaveViewer;
  private readonly spectrogram_viewer: spectrogramViewer;

  constructor(
    private readonly audioElement: HTMLMediaElement,
    waveform_svg: SVGSVGElement,
    spectrogram_svg: SVGSVGElement
  ) {
    const analyser = new AudioAnalyzer(this.audioElement);
    this.wave_viewer = new WaveViewer(analyser, waveform_svg);
    this.spectrogram_viewer = new spectrogramViewer(analyser, spectrogram_svg);
    this.animate();
  }

  animate () {
    this.wave_viewer.drawWaveform();
    this.spectrogram_viewer.drawSpectrogram();
  };
}
