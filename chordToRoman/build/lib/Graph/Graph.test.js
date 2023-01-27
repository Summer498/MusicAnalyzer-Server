"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stdlib_js_1 = require("../StdLib/stdlib.js");
const Graph_js_1 = require("./Graph.js");
const Math_js_1 = require("../Math/Math.js");
/* Viterbi アルゴリズム */
const initial_probabilities = [0.6, 0.4];
const initial_log_probabilities = initial_probabilities.map(e => Math_js_1.Math.log(e));
const transition_probabilities = [
    [0.7, 0.3],
    [0.4, 0.6],
];
const transition_log_probabilities = transition_probabilities.map(e => e.map(e => Math_js_1.Math.log(e)));
const emission_probabilities = [
    [0.5, 0.4, 0.1],
    [0.1, 0.3, 0.6],
];
const emission_log_probabilities = emission_probabilities.map(e => e.map(e => Math_js_1.Math.log(e)));
const observation_sequence = [0, 1, 2];
const states = Math_js_1.Math.getRange(0, initial_log_probabilities.length);
const dynamic_log_viterbi = (0, Graph_js_1.dynamicLogViterbi)(initial_log_probabilities, () => states, (i, j) => transition_log_probabilities[i][j], (i, j) => emission_log_probabilities[i][j], observation_sequence);
const log_viterbi = (0, Graph_js_1.logViterbi)(initial_log_probabilities, transition_log_probabilities, emission_log_probabilities, observation_sequence);
const viterbied = (0, Graph_js_1.viterbi)(initial_probabilities, transition_probabilities, emission_probabilities, observation_sequence);
new stdlib_js_1.Assertion((0, stdlib_js_1.hasSameValue)(dynamic_log_viterbi, log_viterbi))
    .onFailed(() => {
    throw new Error("Both result of dynamicLogViterbi and logViterbi must be same value. ");
});
new stdlib_js_1.Assertion(Math_js_1.Math.exp(log_viterbi.log_probability) == viterbied.probability)
    .onFailed(() => {
    throw new Error("logViterbi(...).log_probability must be equal to Math.log(viterbi(...).probability) . ");
});
new stdlib_js_1.Assertion(Math_js_1.Math.sameArray(log_viterbi.trace, viterbied.trace))
    .onFailed(() => {
    throw new Error("logViterbi(...).trace and viterbi(...).trace must be same value");
});
const expected_probability = 0.01512;
new stdlib_js_1.Assertion(Math_js_1.Math.abs(viterbied.probability - expected_probability) < Math_js_1.Math.pow(10, -15))
    .onFailed(() => {
    throw new Error(`Assertion failed: (viterbied.probability = ${viterbied.probability}) != ${expected_probability}`);
});
// const expected_trace = [[0],[0],[1]];
const expected_trace = [[0, 0, 1]];
new stdlib_js_1.Assertion(Math_js_1.Math.sameArray(viterbied.trace, expected_trace))
    .onFailed(() => {
    throw new Error(`Assertion failed: (viterbied.trace = ${viterbied.trace}) != ${expected_trace}`);
});
//# sourceMappingURL=Graph.test.js.map