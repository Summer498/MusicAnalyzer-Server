import { connect } from "./connect";
import { getByteFrequencyData } from "./get-data-on-buffer";
import { getByteTimeDomainData } from "./get-data-on-buffer";
import { getFloatFrequencyData } from "./get-data-on-buffer";
import { getFloatTimeDomainData } from "./get-data-on-buffer";
import { getFFT } from "./get-fft";

const resumeAudioCtx = (audioCtx: AudioContext) => () => { audioCtx.state === 'suspended' && audioCtx.resume(); }

export interface AudioAnalyzer {
  readonly analyser: AnalyserNode;
  getByteTimeDomainData(): Uint8Array;
  getFloatTimeDomainData(): Float32Array;
  getByteFrequencyData(): Uint8Array;
  getFloatFrequencyData(): Float32Array;
  getFFT(): [Float32Array, Float32Array];
}

export const createAudioAnalyzer = (
  audioElement: HTMLAudioElement,
  contextFactory: () => AudioContext = () => new AudioContext(),
): AudioAnalyzer => {
  const audioCtx = contextFactory();
  const source = audioCtx.createMediaElementSource(audioElement);
  const analyser = audioCtx.createAnalyser();

  audioElement.addEventListener("play", resumeAudioCtx(audioCtx));
  analyser.fftSize = 1024;
  connect(source, analyser, audioCtx.destination);

  return {
    analyser,
    getByteTimeDomainData: () => getByteTimeDomainData(analyser),
    getFloatTimeDomainData: () => getFloatTimeDomainData(analyser),
    getByteFrequencyData: () => getByteFrequencyData(analyser),
    getFloatFrequencyData: () => getFloatFrequencyData(analyser),
    getFFT: () => getFFT(analyser),
  };
};
