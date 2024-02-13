import { Assertion, hasSameValue } from "../StdLib/";
import { dynamicLogViterbi, logViterbi, viterbi } from "./";
import { Math } from "../Math";

describe("dummy", () => {
  test("dummy", () => {
    expect(1).toBe(1);
  });
});

// TODO: jest 化
const comment = () => {
  /* Viterbi アルゴリズム */
  const initial_probabilities = [0.6, 0.4];
  const initial_log_probabilities = initial_probabilities.map((e) =>
    Math.log(e),
  );
  const transition_probabilities = [
    [0.7, 0.3],
    [0.4, 0.6],
  ];
  const transition_log_probabilities = transition_probabilities.map((e) =>
    e.map((e) => Math.log(e)),
  );
  const emission_probabilities = [
    [0.5, 0.4, 0.1],
    [0.1, 0.3, 0.6],
  ];
  const emission_log_probabilities = emission_probabilities.map((e) =>
    e.map((e) => Math.log(e)),
  );
  const observation_sequence = [0, 1, 2];
  const states = Math.getRange(0, initial_log_probabilities.length);
  const dynamic_log_viterbi = dynamicLogViterbi(
    initial_log_probabilities,
    () => states,
    (i, j) => transition_log_probabilities[i][j],
    (i, j) => emission_log_probabilities[i][j],
    observation_sequence,
  );
  const log_viterbi = logViterbi(
    initial_log_probabilities,
    transition_log_probabilities,
    emission_log_probabilities,
    observation_sequence,
  );
  const viterbied = viterbi(
    initial_probabilities,
    transition_probabilities,
    emission_probabilities,
    observation_sequence,
  );

  describe("Viterbi Algorithm test", () => {
    test("dynamic_log_viterbi includes log_viterbi", () => {
      expect(hasSameValue(dynamic_log_viterbi, log_viterbi)).toBe(true);
    });
  });

  new Assertion(hasSameValue(dynamic_log_viterbi, log_viterbi)).onFailed(() => {
    throw new Error(
      "Both result of dynamicLogViterbi and logViterbi must be same value. ",
    );
  });
  new Assertion(
    Math.exp(log_viterbi.log_probability) == viterbied.probability,
  ).onFailed(() => {
    throw new Error(
      "logViterbi(...).log_probability must be equal to Math.log(viterbi(...).probability) . ",
    );
  });
  new Assertion(Math.sameArray(log_viterbi.trace, viterbied.trace)).onFailed(
    () => {
      throw new Error(
        "logViterbi(...).trace and viterbi(...).trace must be same value",
      );
    },
  );
  const expected_probability = 0.01512;
  new Assertion(
    Math.abs(viterbied.probability - expected_probability) < Math.pow(10, -15),
  ).onFailed(() => {
    throw new Error(
      `Assertion failed: (viterbied.probability = ${viterbied.probability}) != ${expected_probability}`,
    );
  });
  // const expected_trace = [[0],[0],[1]];
  const expected_trace = [[0, 0, 1]];
  new Assertion(Math.sameArray(viterbied.trace, expected_trace)).onFailed(
    () => {
      throw new Error(
        `Assertion failed: (viterbied.trace = ${viterbied.trace}) != ${expected_trace}`,
      );
    },
  );
};
