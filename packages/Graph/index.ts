import { Math } from "../Math";

type Compare = (a: number, b: number) => boolean;
export const findMin: Compare = (a, b) => a < b;
export const findMax: Compare = (a, b) => a > b;

const argsMinMax = <T>(
  f: (i: T) => number,
  space: Array<T>,
  compare: Compare,
) => {
  let val = compare(0, 1) ? Infinity : -Infinity;
  let args: T[] = [];
  for (const e of space) {
    const v = f(e);
    if (compare(v, val)) {
      val = v;
      args = [e];
    } else if (val === v) {
      args.push(e);
    }
  }
  return { val, args };
};

const minMax = <T>(f: (i: T) => number, space: Array<T>, compare: Compare) => {
  let val = compare(0, 1) ? Infinity : -Infinity;
  for (const e of space) {
    const v = f(e);
    if (compare(v, val)) {
      val = v;
    }
  }
  return val;
};

const newArray = <T>(n: number) => [...Array<T>(n)];

const _dynamicLogViterbi = (
  pi: number[],
  getStates: (time: number) => number[],
  A: (
    prev_time: number,
    time: number,
    prev_state: number,
    state: number,
  ) => number,
  B: (state: number, observation: number) => number,
  Y: number[],
  compare: Compare,
): {
  log_probability: number;
  trace: number[][];
} => {
  const S = pi.length;
  const T = Y.length;
  const t1 = newArray<number>(S);
  const T2 = newArray(T).map(_ => newArray(S).map(_ => newArray<number>(0)),);
  let states = getStates(0);

  // initialize
  states.forEach(s => {
    t1[s] = pi[s] === undefined ? 0 : pi[s] + B(s, Y[0]);
  });
  states.forEach(s => {
    T2[0][s][0] = 0;
  });
  // 帰納
  for (let j = 1; j < T; j++) {
    const _states = states;
    states = getStates(j);
    const _t1 = [...t1];
    states.forEach(i => {
      const f = (k: number) => _t1[k] + A(j - 1, j, k, i);
      const minmax = argsMinMax(f, _states, compare);
      t1[i] = minmax.val + B(i, Y[j]);
      T2[j][i] = minmax.args; // 最大/最小が複数得られるかもしれない
    });
  }
  // 終了
  // TODO: ココから Wikipedia コードに合わせていく

  const zn_T = argsMinMax(k => t1[k], states, compare).args; // terminals
  const N = zn_T.length;

  const z = newArray(N).map(_ => newArray<number>(T)); // state_trace_paths
  for (let i = 0; i < N; i++) {
    z[i][T - 1] = zn_T[i];
  }
  // if (z.length !== N) { console.error(`z.length(${z.length})===N(${N}) failure`); exit(0); }

  // console.error(`T = ${T}`);
  for (let i = 0; i < z.length; i++) {
    for (let j = T - 1; j > 0; j--) {
      z[i][j - 1] = T2[j][z[i][j]][0]; // 最大/最小は基本1つ取れる

      /* NOTE: 複数の調候補がある場合に対応できるようにするコード
            // メモリ消費量が大きいので消している
            for (let k = 0; k < T2[j][z[i][j]].length; k++) {
                z[i][k] = [...z[i]];
                z[i][k][j - 1] = T2[j][z[i][j]][k];
            }
            //*/
    }
  }
  // console.error(`z`)
  // console.error(z);
  // console.error("2つ目の処理OK");

  return {
    log_probability: t1[zn_T[0]],
    // trace: state_trace  // state_trace[t] は時刻 t における最短経路上のノード全て
    trace: z, // state_trace_paths[i] は i 番目の最短経路
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
export const dynamicLogViterbi = (
  initial_log_probabilities: number[],
  getStatesOnTheTime: (time: number) => number[],
  transitionLogProbabilities: (
    prev_time: number,
    time: number,
    prev_state: number,
    state: number,
  ) => number,
  emissionLogProbabilities: (state: number, observation: number) => number,
  observation_sequence: number[],
  compare: Compare = findMax,
) =>
  _dynamicLogViterbi(
    initial_log_probabilities,
    getStatesOnTheTime,
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
export const logViterbi = (
  initial_log_probabilities: number[],
  transition_log_probabilities: number[][],
  emission_log_probabilities: number[][],
  observation_sequence: number[],
) => {
  const states = Math.getRange(0, initial_log_probabilities.length);
  return dynamicLogViterbi(
    initial_log_probabilities,
    () => states,
    (prev_time: number, time: number, prev_state: number, state: number) =>
      transition_log_probabilities[prev_state][state],
    (state: number, observation: number) =>
      emission_log_probabilities[state][observation],
    observation_sequence,
  );
};

export const viterbi = (
  initial_probabilities: number[],
  transition_probabilities: number[][],
  emission_probabilities: number[][],
  observation_sequence: number[],
) => {
  const log_viterbi = logViterbi(
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
