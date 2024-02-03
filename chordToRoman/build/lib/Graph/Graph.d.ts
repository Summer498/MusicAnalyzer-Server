type Compare = (a: number, b: number) => boolean;
export declare const findMin: Compare;
export declare const findMax: Compare;
/**
 * @brief dynamic changeable viterbi algorithm
 * @param initial_log_probabilities
 * @param transitionLogProbabilities can change dynamically but independent to any past transition
 * @param emissionLogProbabilities can change dynamically but independent to any past transition
 * @param observation_sequence
 * @returns Probability of the most likely transition trace and the trace
 */
export declare const dynamicLogViterbi: (initial_log_probabilities: number[], getStatesOnTheTime: (time: number) => number[], transitionLogProbabilities: (prev_time: number, time: number, prev_state: number, state: number) => number, emissionLogProbabilities: (state: number, observation: number) => number, observation_sequence: number[], compare?: Compare) => {
    log_probability: number;
    trace: number[][];
};
/**
 * @brief viterbi algorithm
 * @param initial_log_probabilities
 * @param transition_log_probabilities
 * @param emission_log_probabilities
 * @param observation_sequence
 * @returns Probability of the most likely transition trace and the trace
 */
export declare const logViterbi: (initial_log_probabilities: number[], transition_log_probabilities: number[][], emission_log_probabilities: number[][], observation_sequence: number[]) => {
    log_probability: number;
    trace: number[][];
};
export declare const viterbi: (initial_probabilities: number[], transition_probabilities: number[][], emission_probabilities: number[][], observation_sequence: number[]) => {
    probability: number;
    trace: number[][];
};
export {};
