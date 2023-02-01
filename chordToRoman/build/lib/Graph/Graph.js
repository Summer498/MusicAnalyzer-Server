"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MaxCalculableArray_instances, _MaxCalculableArray_args, _MaxCalculableArray_values, _MaxCalculableArray_memo_funcs, _MaxCalculableArray_willRenew, _MaxCalculableArray_renew_min_or_max, _MaxCalculableArray_checkCache;
Object.defineProperty(exports, "__esModule", { value: true });
exports.viterbi = exports.logViterbi = exports.dynamicLogViterbi = void 0;
const Math_js_1 = require("../Math/Math.js");
class MaxCalculableArray extends Array {
    constructor(...items) {
        super(items.length);
        _MaxCalculableArray_instances.add(this);
        _MaxCalculableArray_args.set(this, void 0);
        _MaxCalculableArray_values.set(this, void 0);
        _MaxCalculableArray_memo_funcs.set(this, void 0);
        _MaxCalculableArray_willRenew.set(this, [
            val => val < __classPrivateFieldGet(this, _MaxCalculableArray_values, "f")[0],
            val => val > __classPrivateFieldGet(this, _MaxCalculableArray_values, "f")[1]
        ]);
        __classPrivateFieldSet(this, _MaxCalculableArray_args, [[this[0]], [this[0]]], "f");
        __classPrivateFieldSet(this, _MaxCalculableArray_values, [Infinity, -Infinity], "f");
        __classPrivateFieldSet(this, _MaxCalculableArray_memo_funcs, [undefined, undefined], "f");
        items.forEach((_, i) => { this[i] = items[i]; });
    }
    min(f) { __classPrivateFieldGet(this, _MaxCalculableArray_instances, "m", _MaxCalculableArray_checkCache).call(this, f, 0); return __classPrivateFieldGet(this, _MaxCalculableArray_values, "f")[0]; }
    argMin(f) { __classPrivateFieldGet(this, _MaxCalculableArray_instances, "m", _MaxCalculableArray_checkCache).call(this, f, 0); return __classPrivateFieldGet(this, _MaxCalculableArray_args, "f")[0][0]; }
    argMins(f) { __classPrivateFieldGet(this, _MaxCalculableArray_instances, "m", _MaxCalculableArray_checkCache).call(this, f, 0); return __classPrivateFieldGet(this, _MaxCalculableArray_args, "f")[0]; }
    max(f) { __classPrivateFieldGet(this, _MaxCalculableArray_instances, "m", _MaxCalculableArray_checkCache).call(this, f, 1); return __classPrivateFieldGet(this, _MaxCalculableArray_values, "f")[1]; }
    argMax(f) { __classPrivateFieldGet(this, _MaxCalculableArray_instances, "m", _MaxCalculableArray_checkCache).call(this, f, 1); return __classPrivateFieldGet(this, _MaxCalculableArray_args, "f")[1][0]; }
    argMaxes(f) { __classPrivateFieldGet(this, _MaxCalculableArray_instances, "m", _MaxCalculableArray_checkCache).call(this, f, 1); return __classPrivateFieldGet(this, _MaxCalculableArray_args, "f")[1]; }
}
_MaxCalculableArray_args = new WeakMap(), _MaxCalculableArray_values = new WeakMap(), _MaxCalculableArray_memo_funcs = new WeakMap(), _MaxCalculableArray_willRenew = new WeakMap(), _MaxCalculableArray_instances = new WeakSet(), _MaxCalculableArray_renew_min_or_max = function _MaxCalculableArray_renew_min_or_max(f, is_max) {
    __classPrivateFieldGet(this, _MaxCalculableArray_args, "f")[is_max] = [this[0]];
    __classPrivateFieldGet(this, _MaxCalculableArray_values, "f")[is_max] = (is_max) ? -Infinity : Infinity;
    for (const i of this) {
        const val = f(i);
        if (__classPrivateFieldGet(this, _MaxCalculableArray_willRenew, "f")[is_max](val)) {
            __classPrivateFieldGet(this, _MaxCalculableArray_args, "f")[is_max] = [i];
            __classPrivateFieldGet(this, _MaxCalculableArray_values, "f")[is_max] = val;
            continue;
        }
        if (val == __classPrivateFieldGet(this, _MaxCalculableArray_values, "f")[is_max]) {
            __classPrivateFieldGet(this, _MaxCalculableArray_args, "f")[is_max].push(i);
        }
    }
}, _MaxCalculableArray_checkCache = function _MaxCalculableArray_checkCache(f, is_max) {
    if (__classPrivateFieldGet(this, _MaxCalculableArray_memo_funcs, "f")[is_max] === f) {
        return;
    }
    __classPrivateFieldGet(this, _MaxCalculableArray_instances, "m", _MaxCalculableArray_renew_min_or_max).call(this, f, is_max);
    __classPrivateFieldGet(this, _MaxCalculableArray_memo_funcs, "f")[is_max] = f;
};
const newArray = (n) => [...Array(n)];
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
function dynamicLogViterbi(initial_log_probabilities, getStatesOnTheTime, transitionLogProbabilities, emissionLogProbabilities, observation_sequence, will_find_min = false) {
    const pi = initial_log_probabilities;
    const Y = observation_sequence;
    const S = pi.length;
    const T = Y.length;
    const A = transitionLogProbabilities;
    const B = emissionLogProbabilities;
    const t1 = newArray(S);
    const T2 = newArray(T).map(_ => newArray(S).map(_ => newArray(0))); // eslint-disable-line @typescript-eslint/no-unused-vars
    let states = new MaxCalculableArray(...getStatesOnTheTime(0));
    // initialize
    states.forEach(s => { t1[s] = pi[s] + B(s, Y[0]); }); // pi[s] が undefined の場合, 0 にする.
    states.forEach(s => { T2[0][s][0] = 0; });
    // 帰納
    Math_js_1.Math.getRange(1, T).forEach(t => {
        const old_states = states;
        states = new MaxCalculableArray(...getStatesOnTheTime(t));
        const old_t1 = [...t1];
        states.forEach(i => {
            const f = (k) => old_t1[k] + A(t - 1, t, k, i);
            t1[i] = ((will_find_min) ? old_states.min(f) : old_states.max(f)) + B(i, Y[t]);
            T2[t][i] = (will_find_min) ? old_states.argMins(f) : old_states.argMaxes(f);
        });
    });
    // 終了
    const terminals = (will_find_min) ? states.argMins(k => t1[k]) : states.argMaxes(k => t1[k]);
    /*
    // trace back
    const state_trace = newArray(T).map(_ => [0]);
    state_trace[T - 1] = terminals;
    Math.getRange(T - 1, 0, -1).forEach(j => {
        const prev_nodes = state_trace[j].map(node => T2[j][node]).flat(1)  // 最短経路グラフのノードを抽出 (TODO: エッジも考慮した出力をする)
        state_trace[j - 1] = [...new Set(prev_nodes)];
    });
    */
    // console.log(T2);
    /*
    const trace_edge = newArray(T).map(_ => newArray(S).map(_ => newArray<number>(0)));  // eslint-disable-line @typescript-eslint/no-unused-vars
    Math.getRange(T - 1, 0, -1).forEach(j => {

        // trace_edge は最短経路として選ばれたノードの前時刻へのノードが格納された配列であり, 以下では trace_edge を作ろうとしている
        // trace_edge[t][i] == [i2, i3] の場合は [t][i] -- [t][i2] と [t][i] -- [t][i3] のエッジがある.
        // 出力には影響しないがデバッグ用に残しておく
        state_trace[j].forEach(node => trace_edge[j][node] = T2[j][node]);
    });
    */
    let state_trace_pathes = terminals.map(terminal => {
        const ret = newArray(T);
        ret[T - 1] = terminal;
        return ret;
    });
    Math_js_1.Math.getRange(T - 1, 0, -1).forEach(j => {
        const old_state_trace_pathes = [...state_trace_pathes];
        state_trace_pathes = old_state_trace_pathes.map(path => T2[j][path[j]].map(node => {
            const new_path = [...path];
            new_path[j - 1] = node;
            return new_path;
        })).flat(1);
    });
    // console.log("state_trace_pathes");
    // console.log(state_trace_pathes);
    return {
        log_probability: t1[terminals[0]],
        //        trace: state_trace  // state_trace[t] は時刻 t における最短経路上のノード全て
        trace: state_trace_pathes // state_trace_pathes[i] は i 番目の最短経路
    };
}
exports.dynamicLogViterbi = dynamicLogViterbi;
/**
 * @brief viterbi algorithm
 * @param initial_log_probabilities
 * @param transition_log_probabilities
 * @param emission_log_probabilities
 * @param observation_sequence
 * @returns Probability of the most likely transition trace and the trace
 */
const logViterbi = (initial_log_probabilities, transition_log_probabilities, emission_log_probabilities, observation_sequence) => {
    const states = new MaxCalculableArray(...Math_js_1.Math.getRange(0, initial_log_probabilities.length));
    return dynamicLogViterbi(initial_log_probabilities, () => states, (prev_time, time, prev_state, state) => transition_log_probabilities[prev_state][state], (state, observation) => emission_log_probabilities[state][observation], observation_sequence);
};
exports.logViterbi = logViterbi;
const viterbi = (initial_probabilities, transition_probabilities, emission_probabilities, observation_sequence) => {
    const log_viterbi = (0, exports.logViterbi)(initial_probabilities.map(e => Math_js_1.Math.log(e)), transition_probabilities.map(e => e.map(e => Math_js_1.Math.log(e))), emission_probabilities.map(e => e.map(e => Math_js_1.Math.log(e))), observation_sequence);
    return {
        probability: Math_js_1.Math.exp(log_viterbi.log_probability),
        trace: log_viterbi.trace
    };
};
exports.viterbi = viterbi;
//# sourceMappingURL=Graph.js.map