import { RomanNumeral, Tonal } from "tonal/dist";
//*
import {
    Chord,
    Chord_default,
    Interval,
    Note,
    NoteLiteral,
    Scale,
    Scale_default
} from "../adapters/Tonal.js"
//*/
/*
import { Chord } from "@tonaljs/chord"
import Chord_default from "@tonaljs/chord"
import { Interval } from "tonal";
import { Note } from "tonal"
import { NoteLiteral } from "tonal";
import { Scale } from "@tonaljs/scale";
import Scale_default from "@tonaljs/scale"
*/

import { dynamicLogViterbi } from "../Graph/Graph.js";
import { Math } from "../Math/Math.js";
import { Assertion, assertNonNullable, castToNumber, IdDictionary } from "../StdLib/stdlib.js";
import { getDistance, getKeysIncludeTheChord } from "../TPS/TPS.js";

export class RomanChord {
    #scale: Scale;
    #chord: Chord;
    constructor(
        scale: Scale,
        chord: Chord
    ) {
        this.#scale = scale;
        this.#chord = chord;
    }
    get scale() { return this.#scale; }
    get chord() { return this.#chord; }
    get roman() {
        // TODO: 確認しておく: もしかしたら # b がないものだけ出力されるバグがあるかもしれない
        // IV# が IV として出力されるなど?
        const interval = Interval.distance(assertNonNullable(this.#scale.tonic), assertNonNullable(this.#chord.tonic));
        const roman = RomanNumeral.get(Interval.get(interval));
        return roman.roman + " " + this.#chord.type
    }
}

export const getIntervalDegree = (src: NoteLiteral, dst: NoteLiteral) => {
    return castToNumber(Interval.distance(src, dst).slice(0, 1));
};

export const getNonNullableChroma = (note: NoteLiteral) => {
    return assertNonNullable(Note.chroma(note));
};

const getBodyAndRoot = (chord_string: string) => {
    chord_string = chord_string.replace(
        "minor/major",
        "XXXXXXXXXXX"
    );
    let separator = "/";
    let before_separator = chord_string.indexOf(separator);
    if (before_separator < 0) {
        separator = " on ";
        before_separator = chord_string.indexOf(separator);
    }
    chord_string = chord_string.replace(
        "XXXXXXXXXXX",
        "minor/major"
    );

    const body_length = before_separator >= 0 ? before_separator : chord_string.length;
    const body = chord_string.slice(0, body_length);
    const root = chord_string.slice(body_length + separator.length);
    return { body, root };
};

// ルート付きコードが入力されてもコードを得られるようにする.
export const getChord = (chord_string: string): Chord => {
    const body_and_root = getBodyAndRoot(chord_string);
    const root = body_and_root.root;
    const chord = Chord_default.get(body_and_root.body);
    if (chord_string === "") { return chord; }
    new Assertion(chord.tonic != null)
        .onFailed(() => {
            console.log("received:");
            console.log(chord);
            throw new TypeError("tonic must not be null");
        });
    new Assertion(!chord.empty)
        .onFailed(() => {
            console.log("received:");
            console.log(chord);
            throw Error('Illegal chord symbol "' + chord_string + '" received');
        });
    if (root != '' && !chord.notes.includes(root)) {
        // TODO: 現在はベース音をプッシュすると同じ(に見える)コードに対して候補が変化するように見えてしまう
        // ベース音を含むといろいろなコードが想定できるので, 候補スケールとして任意のスケールを使えるようにする
        chord.name += ` on ${root}`;
        chord.notes.push(root);
        chord.symbol += `/${root}`;
    }
    chord.root = root;
    chord.rootDegree = getIntervalDegree(assertNonNullable(chord.tonic), chord.root);
    return chord;
};

export class ChordProgression {
    lead_sheet_chords: string[];
    #chord_dictionary: IdDictionary<string>;
    #scale_dictionary: IdDictionary<string>;
    #setDictionary(lead_sheet_chords: string[]) {
        for (const chord_str of lead_sheet_chords) {
            const chord = getChord(chord_str);
            const candidate_scales = getKeysIncludeTheChord(chord);

            for (const scale of candidate_scales) {
                this.#chord_dictionary.register(chord.name);
                this.#scale_dictionary.register(scale.name);
            }
            if (candidate_scales.length === 0) {
                this.#scale_dictionary.register(Scale_default.get("").name);
            }
        }
    }
    // returns all field
    debug() {
        return {
            lead_sheet_chords: this.lead_sheet_chords,
            chord_dict: this.#chord_dictionary.showAll(),
            scale_dict: this.#scale_dictionary.showAll(),
        };
    }
    constructor(lead_sheet_chords: string[]) {
        this.#chord_dictionary = new IdDictionary<string>();
        this.#scale_dictionary = new IdDictionary<string>();
        this.lead_sheet_chords = lead_sheet_chords;
        this.#setDictionary(lead_sheet_chords);
    }
    getStatesOnTime(t: number) {
        const chord = getChord(this.lead_sheet_chords[t]);
        const candidate_scales = getKeysIncludeTheChord(chord);  // 候補がない時, ここが空配列になる
        if (candidate_scales.length === 0) {
            return [this.#scale_dictionary.getId(Scale_default.get("").name)];
        }
        return candidate_scales.map(scale => this.#scale_dictionary.getId(scale.name));
    }
    getChordIdSequence() {
        return this.lead_sheet_chords.map(chord => this.#chord_dictionary.getId(getChord(chord).name))
    }

    getDistanceOfStates(t1: number, t2: number, s1: number, s2: number) {
        const scale1 = Scale_default.get(this.#scale_dictionary.getItem(s1));
        const scale2 = Scale_default.get(this.#scale_dictionary.getItem(s2));
        const chord1 = getChord(this.lead_sheet_chords[t1]);
        const chord2 = getChord(this.lead_sheet_chords[t2]);
        if (scale1.empty) { console.warn("empty scale received"); return 0; }
        if (scale2.empty) { console.warn("empty scale received"); return 0; }
        return getDistance(
            new RomanChord(scale1, chord1),
            new RomanChord(scale2, chord2)
        )
    }

    getMinimumPath() {
        const viterbi = dynamicLogViterbi(
            Math.getZeros(24),  // 12 音 x {-mol, -dur}
            this.getStatesOnTime.bind(this),
            this.getDistanceOfStates.bind(this),
            () => 0,
            this.getChordIdSequence(),
            true
        );
        // console.log(viterbi)
        const trace = viterbi.trace;
        return trace.map(e => e.map((id, i) => new RomanChord(
            Scale_default.get(this.#scale_dictionary.getItem(id)),
            Chord_default.get(this.lead_sheet_chords[i])
        )))
    }
}

