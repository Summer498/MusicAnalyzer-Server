import { Complex } from "./complex";
import { fft_core } from "./ftt-core";
import { RootOfUnity, createRootOfUnity } from "./root-of-unity";
export { Complex } from "./complex";
export { createRootOfUnity } from "./root-of-unity";

export const fft = <T extends number>(seq: Complex<number>[]): Complex<number>[] => {
  // thanks for fft-js
  const N = Math.pow(2, Math.ceil(Math.log2(seq.length)));
  // zero padding
  while (seq.length < N) {
    seq.push(new Complex<number>(0, 0));
  }
  return fft_core(seq, createRootOfUnity());
};

export const ifft = <T extends number>(seq: Complex<T>[]) => {
  const ps = fft(seq.map(e => new Complex(e.im, e.re)));
  return ps.map(e => new Complex(e.im, e.re).divScaler(ps.length));
};

export const convolution = <T extends number>(seq1: Complex<T>[], seq2: Complex<T>[]) => {
  const f_seq1 = fft(seq1);
  const f_seq2 = fft(seq2);
  const mul = f_seq1.map((e, i) => e.mlt(f_seq2[i]));
  return ifft(mul);
};

export const correlation = <T extends number>(seq1: Complex<T>[], seq2: Complex<T>[]) => convolution(seq1, seq2.reverse());
