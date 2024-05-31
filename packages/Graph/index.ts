import { unique } from "../StdLib";
import { argsMinMax, Compare, CompareFunc } from "../Math";

type LogViterbiResult<S> = {
  log_probability: number;
  trace: S[][];
}
type ViterbiResult<S> = {
  probability: number;
  trace: S[][];
}

/*
const _hhmmLogViterbi = <O, S>(
  q: S[][]
) => {
  const delta: number[][][][] = [];
  const psi: number[][][][][] = [];
  const tau: number[][][][] = [];

  // production states
  // 1. initialization
  delta[0][t][D][i] = pi(q[D-1])(q[D][i]) * b(q[D][i])(o[t]);
  psi[0][t][D][i] = 0;
  tau[0][t][D][i] = t;
  // 2. recursion
  const max = argsMinMax(j => delta[k][t][D][j] * a(q[D-1])[j][i] * b(q[D][i])(o[t+k]), getRange(0, q[D-1].length), findMax);
  delta[k][t][D][i] = max.val;
  psi[k][t][D][i] = max.args;
  tau[k][t][D][i] = t + k;

  // internal states
  // 1. initialization
  delta[0][t][d][i] = minMax(j => pi(q[d-1])(q[d][i]) * delta[0][t][d+1], getRange(0, q[d]), findMax);
};
*/

const _dynamicLogViterbi = <O, S>(
  getStates: (time: number) => S[],
  pi: number[],
  A: (prev_time: number, time: number, prev_state: S, curr_state: S) => number,
  B: (state: S, observation: O) => number,
  Y: O[],
  compare: CompareFunc,
): LogViterbiResult<S> => {
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
  return {
    log_probability: terminal.val,
    trace: x,
  };
};

/*  c.f. Viterbi algorithm - Wikipedia
 *  https://en.wikipedia.org/wiki/Viterbi_algorithm#Pseudocode
 */
/**
 * @brief dynamic changeable viterbi algorithm
 * @param initial_log_probabilities
 * @param transitionLogProbabilities can change dynamically but independent to any past transition
 * @param emissionLogProbabilities can change dynamically but independent to any past transition
 * @param observation_sequence
 * @returns Probability of the most likely transition trace and the trace
 */
export const dynamicLogViterbi = <O, S>(
  getStatesOnTheTime: (time: number) => S[],
  initial_log_probabilities: number[],
  transitionLogProbabilities: (prev_time: number, time: number, prev_state: S, curr_state: S) => number,
  emissionLogProbabilities: (state: S, observation: O) => number,
  observation_sequence: O[],
  compare = Compare.findMax,
) => _dynamicLogViterbi(
  getStatesOnTheTime,
  initial_log_probabilities,
  transitionLogProbabilities,
  emissionLogProbabilities,
  observation_sequence,
  compare,
);

/**
 * @brief viterbi algorithm
 * @param initial_log_probabilities
 * @param transition_log_probabilities
 * @param emission_log_probabilities
 * @param observation_sequence
 * @returns Probability of the most likely transition trace and the trace
 */
export const logViterbi = <O, S>(
  states: S[],
  initial_log_probabilities: number[],
  transitionLogProbabilities: (prev_state: S, curr_state: S) => number,
  emissionLogProbabilities: (state: S, observation: O) => number,
  observation_sequence: O[],
  compare = Compare.findMax,
) => dynamicLogViterbi(
  () => states,
  initial_log_probabilities,
  (pt: number, ct: number, ps: S, cs: S) => transitionLogProbabilities(ps, cs),
  emissionLogProbabilities,
  observation_sequence,
  compare,
);

/**
 * @brief viterbi algorithm
 * @param initial_probabilities
 * @param transition_probabilities
 * @param emission_probabilities
 * @param observation_sequence
 * @returns Probability of the most likely transition trace and the trace
 */
export const viterbi = <O, S>(
  states: S[],
  initial_probabilities: number[],
  transitionProbabilities: (prev_state: S, curr_state: S) => number,
  emissionProbabilities: (state: S, observation: O) => number,
  observation_sequence: O[],
  compare = Compare.findMax,
): ViterbiResult<S> => {
  const log_viterbi = logViterbi(
    states,
    initial_probabilities.map(e => Math.log(e)),
    (p, c) => Math.log(transitionProbabilities(p, c)),
    (s, o) => Math.log(emissionProbabilities(s, o)),
    observation_sequence,
    compare,
  );
  return {
    probability: Math.exp(log_viterbi.log_probability),
    trace: log_viterbi.trace,
  };
};
