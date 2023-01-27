import { Math } from "../Math/Math.js";

class MaxCalculableArray<T> extends Array<T> {
    #args: T[][];
    #values: number[];
    #memo_funcs: (((i: T) => number) | undefined)[];
    constructor(...items: T[]) {
        super(items.length);
        this.#args = [[this[0]], [this[0]]]
        this.#values = [Infinity, -Infinity];
        this.#memo_funcs = [undefined, undefined];
        items.forEach((_, i) => { this[i] = items[i]; });
    }
    #willRenew: ((val: number) => boolean)[] = [
        val => val < this.#values[0],
        val => val > this.#values[1]
    ]
    #renew_min_or_max(f: (i: T) => number, is_max: number) {
        this.#args[is_max] = [this[0]];
        this.#values[is_max] = (is_max) ? -Infinity : Infinity;
        for (const i of this) {
            const val = f(i);
            if (this.#willRenew[is_max](val)) {
                this.#args[is_max] = [i];
                this.#values[is_max] = val;
                continue;
            }
            if (val == this.#values[is_max]) { this.#args[is_max].push(i); }
        }
    }
    #checkCache(f: (i: T) => number, is_max: number) {
        if (this.#memo_funcs[is_max] === f) { return; }
        this.#renew_min_or_max(f, is_max);
        this.#memo_funcs[is_max] = f;
    }
    min(f: (i: T) => number) { this.#checkCache(f, 0); return this.#values[0]; }
    argMin(f: (i: T) => number) { this.#checkCache(f, 0); return this.#args[0][0]; }
    argMins(f: (i: T) => number) { this.#checkCache(f, 0); return this.#args[0]; }
    max(f: (i: T) => number) { this.#checkCache(f, 1); return this.#values[1]; }
    argMax(f: (i: T) => number) { this.#checkCache(f, 1); return this.#args[1][0]; }
    argMaxes(f: (i: T) => number) { this.#checkCache(f, 1); return this.#args[1]; }
}

const newArray = <T>(n: number) => [...Array<T>(n)];

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
export function dynamicLogViterbi(
    initial_log_probabilities: number[],
    getStatesOnTheTime: (time: number) => number[],
    transitionLogProbabilities: (prev_time: number, time: number, prev_state: number, state: number) => number,
    emissionLogProbabilities: (state: number, observation: number) => number,
    observation_sequence: number[],
    will_find_min = false
): { log_probability: number, trace: number[][] } {
    const pi = initial_log_probabilities;
    const Y = observation_sequence;
    const S = pi.length;
    const T = Y.length;
    const A = transitionLogProbabilities
    const B = emissionLogProbabilities
    const t1 = newArray<number>(S);
    const T2 = newArray(T).map(_ => newArray(S).map(_ => newArray<number>(0)));  // eslint-disable-line @typescript-eslint/no-unused-vars
    let states = new MaxCalculableArray(...getStatesOnTheTime(0));

    // initialize
    states.forEach(s => { t1[s] = pi[s] + B(s, Y[0]); });  // pi[s] が undefined の場合, 0 にする.
    states.forEach(s => { T2[0][s][0] = 0; });
    // 帰納
    Math.getRange(1, T).forEach(t => {
        const old_states = states;
        states = new MaxCalculableArray(...getStatesOnTheTime(t));
        const old_t1 = [...t1];
        states.forEach(i => {
            const f = (k: number) => old_t1[k] + A(t - 1, t, k, i);
            t1[i] = ((will_find_min) ? old_states.min(f) : old_states.max(f)) + B(i, Y[t]);
            T2[t][i] = (will_find_min) ? old_states.argMins(f) : old_states.argMaxes(f);
        });
    });
    // 終了
    const terminals = (will_find_min) ? states.argMins(k => t1[k]) : states.argMaxes(k => t1[k])
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
        const ret = newArray<number>(T);
        ret[T - 1] = terminal;
        return ret;
    });
    Math.getRange(T - 1, 0, -1).forEach(j => {
        const old_state_trace_pathes = [...state_trace_pathes];
        state_trace_pathes = old_state_trace_pathes.map(
            path => T2[j][path[j]].map(node => {
                const new_path = [...path];
                new_path[j - 1] = node;
                return new_path;
            })
        ).flat(1);
    });
    // console.log("state_trace_pathes");
    // console.log(state_trace_pathes);

    return {
        log_probability: t1[terminals[0]],
        //        trace: state_trace  // state_trace[t] は時刻 t における最短経路上のノード全て
        trace: state_trace_pathes  // state_trace_pathes[i] は i 番目の最短経路
    };
}

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
    const states = new MaxCalculableArray(...Math.getRange(0, initial_log_probabilities.length));
    return dynamicLogViterbi(
        initial_log_probabilities,
        () => states,
        (prev_time: number, time: number, prev_state: number, state: number) => transition_log_probabilities[prev_state][state],
        (state: number, observation: number,) => emission_log_probabilities[state][observation],
        observation_sequence
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
        observation_sequence
    );
    return {
        probability: Math.exp(log_viterbi.log_probability),
        trace: log_viterbi.trace
    };
};
