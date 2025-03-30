// import { Complex } from "@music-analyzer/math";
// import { fft } from "@music-analyzer/math";
import { fft as fft } from "@music-analyzer/math/src/fft/array";
import { getFloatTimeDomainData } from "./get-data-on-buffer/float-time";

const blackManWindow = (x: Float32Array<ArrayBuffer>) => {
  const c = 0.16;
  const a = [(1 - c) / 2, 1 / 2, c / 2]
  const N = x.length;
return  x.map((e, i) =>
  (a[0]
    - a[1] * Math.cos(2 * Math.PI * i / N
      + a[2] * Math.cos(4 * Math.PI * i / N)
    ) * e))
}

export const getFFT = (analyser: AnalyserNode) => {
  const buff = blackManWindow(getFloatTimeDomainData((analyser)));
  const amplitude: number[] = []
  for (let i = 0; i < buff.length; i++) {
    amplitude.push(buff[i])
  }

//  return fft(amplitude.map(e => new Complex(e, 0)))
  return fft(buff, buff.map(e => 0))
}
