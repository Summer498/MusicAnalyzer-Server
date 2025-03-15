import { Complex, fft } from "@music-analyzer/math";
import { getByteTimeDomainData } from "./get-data-on-buffer";

export const getFFT = (analyser: AnalyserNode) => {
  const buff = getByteTimeDomainData(analyser);
  const amplitude: number[] = []
  for (let i = 0; i < buff.length; i++) {
    amplitude.push(buff[i])
  }
  
  return fft(amplitude.map(e => new Complex(e, 0)))
}
