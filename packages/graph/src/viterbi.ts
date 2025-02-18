import { Compare } from "@music-analyzer/math";
import { logViterbi } from "./log-viterbi";

type ViterbiResult<S> = {
  probability: number;
  trace: S[][];
}


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
