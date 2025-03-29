import { connect } from "./connect";
import { getByteFrequencyData } from "./get-data-on-buffer/byte-frequency";
import { getByteTimeDomainData } from "./get-data-on-buffer/byte-time";
import { getFloatFrequencyData } from "./get-data-on-buffer/float-frequency";
import { getFloatTimeDomainData } from "./get-data-on-buffer/float-time";
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
    this.analyser.fftSize = 1024;
    connect(this.source, this.analyser, this.audioCtx.destination);
  }

  getByteTimeDomainData() { return getByteTimeDomainData(this.analyser); }
  getFloatTimeDomainData() { return getFloatTimeDomainData(this.analyser); }
  getByteFrequencyData() { return getByteFrequencyData(this.analyser); }
  getFloatFrequencyData() { return getFloatFrequencyData(this.analyser); }
  getFFT() { return getFFT(this.analyser); }
}
