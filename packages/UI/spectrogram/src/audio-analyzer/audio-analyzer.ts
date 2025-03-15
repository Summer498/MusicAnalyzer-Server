import { connect } from "./connect";
import { getByteFrequencyData } from "./get-byte-frequency-domain-data";
import { getByteTimeDomainData } from "./get-data-on-buffer";
import { getFFT } from "./get-fft";

const resumeAudioCtx = (audioCtx: AudioContext) => () => { audioCtx.state === 'suspended' && audioCtx.resume(); }

export class AudioAnalyzer {
  private readonly audioCtx: AudioContext;
  private readonly source: MediaElementAudioSourceNode;
  readonly analyser: AnalyserNode;

  constructor(audioElement: HTMLAudioElement) {
    this.audioCtx = new AudioContext();
    this.source = this.audioCtx.createMediaElementSource(audioElement);
    this.analyser = this.audioCtx.createAnalyser();

    audioElement.addEventListener("play", resumeAudioCtx(this.audioCtx));
    this.analyser.fftSize = 2048;
    connect(this.source, this.analyser, this.audioCtx.destination);
  }

  getByteTimeDomainData() { return getByteTimeDomainData(this.analyser); }
  getFFT() { return getFFT(this.analyser); }
  getByteFrequencyData() { return getByteFrequencyData(this.analyser); }
}
