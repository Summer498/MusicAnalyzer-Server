import { Compare } from "@music-analyzer/math";
import { viterbiCore } from "./viterbi-core";

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
) => viterbiCore(
  getStatesOnTheTime,
  initial_log_probabilities,
  transitionLogProbabilities,
  emissionLogProbabilities,
  observation_sequence,
  compare,
);
