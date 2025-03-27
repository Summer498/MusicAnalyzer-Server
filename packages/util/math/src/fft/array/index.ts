import { mltV2VC } from "./complex";
import { revVC } from "./complex";
import { sclV2R } from "./complex";
import { F32V } from "./ftt-core";
import { fft_core } from "./ftt-core";

// thanks for fft-js
export const fft = <T extends number>(...seq: [F32V, F32V]): [F32V, F32V] => {
  const N = Math.sqrt(seq[0].length);
  return sclV2R(fft_core(...seq), 1 / N);
};

export const ifft = <T extends number>(...seq: [F32V, F32V]) => {
  const ps = fft(seq[1], seq[0]);
  return [ps[1], ps[0]];
};

export const convolution = <T extends number>(seq1: [F32V, F32V], seq2: [F32V, F32V]) => {
  const f_seq1 = fft(...seq1);
  const f_seq2 = fft(...seq2);
  const mul =  mltV2VC(f_seq1, f_seq2);
  return ifft(...mul);
};

export const correlation = <T extends number>(seq1: [F32V, F32V], seq2: [F32V, F32V]) => convolution(seq1, revVC(seq2));
