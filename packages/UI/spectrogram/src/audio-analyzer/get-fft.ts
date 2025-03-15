import { Complex, fft } from "@music-analyzer/math";
import { getByteTimeDomainData } from "./get-byte-time-domain-data";

export const getFFT = (analyser: AnalyserNode) => {
  const buff = getByteTimeDomainData(analyser);
  const amplitude: number[] = []
  for (let i = 0; i < buff.length; i++) {
    amplitude.push(buff[i])
  }
  return fft(amplitude.map(e => new Complex(e, 0)))
}
