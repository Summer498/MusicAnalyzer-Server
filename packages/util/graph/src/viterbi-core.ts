import { unique } from "@music-analyzer/stdlib";
import { argsMinMax } from "@music-analyzer/math";
import { CompareFunc } from "@music-analyzer/math";

class LogViterbiResult<S> {
  constructor(
    readonly log_probability: number,
    readonly trace: S[][],
  ) { }
}

export const viterbiCore = <O, S>(
  getStates: (time: number) => S[],
  pi: number[],
  A: (prev_time: number, time: number, prev_state: S, curr_state: S) => number,
  B: (state: S, observation: O) => number,
  Y: O[],
  compare: CompareFunc,
) => {
  const states = [getStates(0)];  // 最後の trace で回収するためのメモ
  const T = Y.length;
  const T1 = [[0]];
  const T2 = [[states[0]]];

  // initialize
  states[0].forEach((s_i, i) => {
    T1[0][i] = (pi[i] || 0) + B(s_i, Y[0]);
    T2[0][i] = states[0];
  });
  // 帰納
  for (let j = 1; j < T; j++) {
    states[j] = getStates(j);
    states[j].forEach((s_i, i) => {
      const minmax = argsMinMax((s_k, k) => T1[j - 1][k] + A(j - 1, j, s_k, s_i), states[j - 1], compare);
      T1[j] = T1[j] || [];
      T2[j] = T2[j] || [];
      T1[j][i] = minmax.val + B(s_i, Y[j]);
      T2[j][i] = minmax.args; // 最大/最小が複数得られるかもしれない
    });
  }
  // 終了
  // トレース
  const x = [[states[0][0]]];
  const terminal = argsMinMax((s_k, k) => T1[T - 1][k], states[T - 1], compare);
  x[T - 1] = terminal.args;
  for (let j = T - 1; j > 0; j--) {
    x[j - 1] = unique(x[j].map(x_j => states[j].indexOf(x_j)).map(i => T2[j][i]).flat()); // 最大/最小は基本1つ取れる
  }
  return new LogViterbiResult(
    terminal.val,
    x,
  );
};

