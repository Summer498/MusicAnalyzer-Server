import { mod } from "../basic-function";

export const ringShift = <T>(array: T[], b: number) => {
  const N = array.length;
  const bm = mod(b, N);
  return array.concat(array).slice(N - bm, 2 * N - bm);
};