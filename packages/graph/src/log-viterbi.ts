import { Compare } from "@music-analyzer/math";
import { dynamicLogViterbi } from "./dynamic-log-viterbi";

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
