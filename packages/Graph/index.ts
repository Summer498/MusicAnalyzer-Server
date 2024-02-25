import { unique } from "../StdLib";

type Compare = (a: number, b: number) => boolean;
export const findMin: Compare = (a, b) => a < b;
export const findMax: Compare = (a, b) => a > b;

const argsMinMax = <T>(f: (e: T, i: number) => number, space: T[], compare: Compare,) => {
  let val = compare(0, 1) ? Infinity : -Infinity;
  let args: T[] = [];
  space.forEach((c, i) => {
    const v = f(c, i);
    if (compare(v, val)) { val = v; args = [c]; }
    else if (val === v) { args.push(c); }
  });
  return { val, args };
};

const minMax = <T>(f: (e: T) => number, space: T[], compare: Compare) => {
  let p = compare(0, 1) ? Infinity : -Infinity;
  for (const c of space) {
    const val = f(c);
    if (compare(val, p)) { p = val; }
  }
  return p;
};

type LogViterbiResult<S> = {
  log_probability: number;
  trace: S[][];
}
type ViterbiResult<S> = {
  probability: number;
  trace: S[][];
}
const _dynamicLogViterbi = <O, S>(
  getStates: (time: number) => S[],
  pi: number[],
  A: (prev_time: number, time: number, prev_state: S, curr_state: S) => number,
  B: (state: S, observation: O) => number,
  Y: O[],
  compare: Compare,
): LogViterbiResult<S> => {
  const states = [getStates(0)];  // 最後の trace で回収するためのメモ
  const T = Y.length;
  const T1 = [[0]];
  const T2 = [[states[0]]];

  console.error("dynamic log viterbi: v0.0.5");

  // initialize
  states[0].forEach((s_i, i) => {
    T1[0][i] = pi[i] === undefined ? 0 : pi[i] + B(s_i, Y[0]);
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

  console.error(`T = ${T}`);
  console.error(`x.length = ${x.length}`);
  console.error(x.map(e=>e.length));
  console.error(x.map(e=>e.map(e=>JSON.stringify(e))));
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
  compare = findMax,
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
  transition_log_probabilities: number[][],
  emission_log_probabilities: number[][],
  observation_sequence: O[],
) => {
  const o = Array.from(new Set(observation_sequence));
  const o2i = (e: O) => o.indexOf(e);
  const s2i = (e: S) => states.indexOf(e);
  return dynamicLogViterbi(
    () => states,
    initial_log_probabilities,
    (prev_time: number, time: number, prev_state: S, curr_state: S) => transition_log_probabilities[s2i(prev_state)][s2i(curr_state)],
    (state: S, observation: O) => emission_log_probabilities[s2i(state)][o2i(observation)],
    observation_sequence,
  );
};

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
  transition_probabilities: number[][],
  emission_probabilities: number[][],
  observation_sequence: O[],
): ViterbiResult<S> => {
  const log_viterbi = logViterbi(
    states,
    initial_probabilities.map(e => Math.log(e)),
    transition_probabilities.map(e => e.map(e => Math.log(e))),
    emission_probabilities.map(e => e.map(e => Math.log(e))),
    observation_sequence,
  );
  return {
    probability: Math.exp(log_viterbi.log_probability),
    trace: log_viterbi.trace,
  };
};
