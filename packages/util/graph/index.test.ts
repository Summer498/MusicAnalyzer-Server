import { dynamicLogViterbi, logViterbi, viterbi } from ".";

// Viterbi アルゴリズム
// test case from: https://en.wikipedia.org/wiki/Viterbi_algorithm
type Observation = "Normal" | "Cold" | "Dizzy"
type States = "Healthy" | "Fever"
const states: States[] = ["Healthy", "Fever"];
const observations: Observation[] = ["Normal", "Cold", "Dizzy"];
const initial_probabilities = [0.6, 0.4];
const initial_log_probabilities = initial_probabilities.map(e => Math.log(e),);
const transition_probabilities = [
  [0.7, 0.3],
  [0.4, 0.6],
];
const transition_log_probabilities = transition_probabilities.map(e => e.map(e => Math.log(e)));
const emission_probabilities = [
  [0.5, 0.4, 0.1],
  [0.1, 0.3, 0.6],
];
const emission_log_probabilities = emission_probabilities.map(e => e.map(e => Math.log(e)));
const observation_sequence: Observation[] = ["Normal", "Cold", "Dizzy"];

const expected_trace: States[][] = [["Healthy"], ["Healthy"], ["Fever"]];
const expected_probability = 0.01512;

describe("viterbi algorithms", () => {
  test("dynamic log viterbi test", () => {
    const dynamic_log_viterbi_res = dynamicLogViterbi(
      () => states,
      initial_log_probabilities,
      (pt, ct, ps, cs) => transition_log_probabilities[states.indexOf(ps)][states.indexOf(cs)],
      (s, o) => emission_log_probabilities[states.indexOf(s)][observations.indexOf(o)],
      observation_sequence,
    );

    expect(dynamic_log_viterbi_res.trace).toEqual(expected_trace);
    expect(dynamic_log_viterbi_res.log_probability).toBeCloseTo(Math.log(expected_probability), 15);
  });

  test("dynamic log viterbi with empty init test", () => {
    const dynamic_log_viterbi_res_with_empty_init = dynamicLogViterbi(
      () => states,
      [],
      (pt, ct, ps, cs) => transition_log_probabilities[states.indexOf(ps)][states.indexOf(cs)],
      (s, o) => emission_log_probabilities[states.indexOf(s)][observations.indexOf(o)],
      observation_sequence,
    );

    expect(dynamic_log_viterbi_res_with_empty_init.trace).toEqual(expected_trace);
    expect(dynamic_log_viterbi_res_with_empty_init.log_probability).toBe(Math.log(0.0252));
  });

  test("log viterbi test", () => {
    const log_viterbi_res = logViterbi(
      states,
      initial_log_probabilities,
      (p, c) => transition_log_probabilities[states.indexOf(p)][states.indexOf(c)],
      (s, o) => emission_log_probabilities[states.indexOf(s)][observations.indexOf(o)],
      observation_sequence,
    );

    expect(log_viterbi_res.trace).toEqual(expected_trace);
    expect(log_viterbi_res.log_probability).toBeCloseTo(Math.log(expected_probability), 15);
  });

  test("viterbi test", () => {
    const viterbi_res = viterbi(
      states,
      initial_probabilities,
      (p, c) => transition_probabilities[states.indexOf(p)][states.indexOf(c)],
      (s, o) => emission_probabilities[states.indexOf(s)][observations.indexOf(o)],
      observation_sequence,
    );

    expect(viterbi_res.trace).toEqual(expected_trace);
    expect(viterbi_res.probability).toBeCloseTo(expected_probability, 15);
  });
});
