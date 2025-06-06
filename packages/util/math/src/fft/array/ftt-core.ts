import { RootOfUnity, createRootOfUnity } from "./root-of-unity";
import { addV2VC } from "./complex";
import { mltV2VC } from "./complex";
import { subV2VC } from "./complex";
import { TypedArray } from "../typed-array";

const root_of_unity = createRootOfUnity();

export type F32V = Float32Array<ArrayBuffer>

const addAndSub = <T extends TypedArray>(x: [T, T], y: [T, T]) => [
  addV2VC(x, y),
  subV2VC(x, y),
]
export const fft_core = (
  ...seq: [F32V, F32V]
): [F32V, F32V] => {
  const N = seq[0].length;
  if (N <= 1) { return seq; }

  const E = fft_core(...[
    seq[0].filter((_, i) => i % 2 === 0),
    seq[1].filter((_, i) => i % 2 === 0),
  ]);
  const O = fft_core(...[
    seq[0].filter((_, i) => i % 2 === 1),
    seq[1].filter((_, i) => i % 2 === 1),
  ]);

  const R = mltV2VC(O, root_of_unity.exponentList(N))
  const add_sub = addAndSub(E, R);

  return [
    new Float32Array([...add_sub[0][0], ...add_sub[1][0]]),
    new Float32Array([...add_sub[0][1], ...add_sub[1][1]]),
  ];
};
