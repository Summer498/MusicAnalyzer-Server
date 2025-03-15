import { Complex } from "./complex";
import { RootOfUnity } from "./root-of-unity";

export const fft_core = <T extends number>(
  seq: Complex<number>[],
  root_of_unity: RootOfUnity,
): Complex<number>[] => {
  const N = seq.length;
  const res: Complex<number>[] = [];

  if (N == 1) { return seq; }

  const X_evens = fft_core(seq.filter((_, i) => i % 2 === 0), root_of_unity);
  const X_odds = fft_core(seq.filter((_, i) => i % 2 == 1), root_of_unity);

  for (let k = 0; k < N / 2; k++) {
    const evens = X_evens[k];
    const rotated_odds = X_odds[k].mlt(root_of_unity.exponent(k, N));
    res[k] = evens.add(rotated_odds);
    res[k + N / 2] = evens.sub(rotated_odds);
  }
  return res;
};
