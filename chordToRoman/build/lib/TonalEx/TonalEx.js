"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _RomanChord_instances, _RomanChord_get_roman, _ChordProgression_instances, _ChordProgression_chord_dictionary, _ChordProgression_scale_dictionary, _ChordProgression_setDictionary;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChordProgression = exports.getChord = exports.getNonNullableChroma = exports.getIntervalDegree = exports.RomanChord = void 0;
const dist_1 = require("tonal/dist");
//*
const Tonal_js_1 = require("../adapters/Tonal.js");
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
const Graph_js_1 = require("../Graph/Graph.js");
const Math_js_1 = require("../Math/Math.js");
const stdlib_js_1 = require("../StdLib/stdlib.js");
const TPS_js_1 = require("../TPS/TPS.js");
class RomanChord {
    constructor(scale, chord) {
        _RomanChord_instances.add(this);
        this.scale = scale;
        this.chord = chord;
        this.roman = __classPrivateFieldGet(this, _RomanChord_instances, "m", _RomanChord_get_roman).call(this, scale, chord);
    }
}
exports.RomanChord = RomanChord;
_RomanChord_instances = new WeakSet(), _RomanChord_get_roman = function _RomanChord_get_roman(scale, chord) {
    // TODO: 確認しておく: もしかしたら # b がないものだけ出力されるバグがあるかもしれない
    // IV# が IV として出力されるなど?
    if (chord.tonic === null) {
        throw TypeError("chord.tonic should not be null");
    }
    const tonic = chord.tonic;
    const true_tonic = scale.notes.find(e => Tonal_js_1.Note.chroma(e) === Tonal_js_1.Note.chroma(tonic));
    const interval = Tonal_js_1.Interval.distance((0, stdlib_js_1.assertNonNullable)(scale.tonic), (0, stdlib_js_1.assertNonNullable)(true_tonic));
    const roman = dist_1.RomanNumeral.get(Tonal_js_1.Interval.get(interval));
    return roman.roman + " " + chord.type;
};
const getIntervalDegree = (src, dst) => {
    return (0, stdlib_js_1.castToNumber)(Tonal_js_1.Interval.distance(src, dst).slice(0, 1));
};
exports.getIntervalDegree = getIntervalDegree;
const getNonNullableChroma = (note) => {
    return (0, stdlib_js_1.assertNonNullable)(Tonal_js_1.Note.chroma(note));
};
exports.getNonNullableChroma = getNonNullableChroma;
const getBodyAndRoot = (chord_string) => {
    chord_string = chord_string.replace("minor/major", "XXXXXXXXXXX");
    let separator = "/";
    let before_separator = chord_string.indexOf(separator);
    if (before_separator < 0) {
        separator = " on ";
        before_separator = chord_string.indexOf(separator);
    }
    chord_string = chord_string.replace("XXXXXXXXXXX", "minor/major");
    const body_length = before_separator >= 0 ? before_separator : chord_string.length;
    const body = chord_string.slice(0, body_length);
    const root = chord_string.slice(body_length + separator.length);
    return { body, root };
};
// ルート付きコードが入力されてもコードを得られるようにする.
const getChord = (chord_string) => {
    const body_and_root = getBodyAndRoot(chord_string);
    const root = body_and_root.root;
    const chord = Tonal_js_1.Chord_default.get(body_and_root.body);
    if (chord_string === "") {
        return chord;
    }
    new stdlib_js_1.Assertion(chord.tonic != null)
        .onFailed(() => {
        console.log("received:");
        console.log(chord);
        throw new TypeError("tonic must not be null");
    });
    new stdlib_js_1.Assertion(!chord.empty)
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
    chord.rootDegree = (0, exports.getIntervalDegree)((0, stdlib_js_1.assertNonNullable)(chord.tonic), chord.root);
    return chord;
};
exports.getChord = getChord;
class ChordProgression {
    // returns all field
    debug() {
        return {
            lead_sheet_chords: this.lead_sheet_chords,
            chord_dict: __classPrivateFieldGet(this, _ChordProgression_chord_dictionary, "f").showAll(),
            scale_dict: __classPrivateFieldGet(this, _ChordProgression_scale_dictionary, "f").showAll(),
        };
    }
    constructor(lead_sheet_chords) {
        _ChordProgression_instances.add(this);
        _ChordProgression_chord_dictionary.set(this, void 0);
        _ChordProgression_scale_dictionary.set(this, void 0);
        __classPrivateFieldSet(this, _ChordProgression_chord_dictionary, new stdlib_js_1.IdDictionary(), "f");
        __classPrivateFieldSet(this, _ChordProgression_scale_dictionary, new stdlib_js_1.IdDictionary(), "f");
        this.lead_sheet_chords = lead_sheet_chords;
        __classPrivateFieldGet(this, _ChordProgression_instances, "m", _ChordProgression_setDictionary).call(this, lead_sheet_chords);
    }
    getStatesOnTime(t) {
        const chord = (0, exports.getChord)(this.lead_sheet_chords[t]);
        const candidate_scales = (0, TPS_js_1.getKeysIncludeTheChord)(chord); // 候補がない時, ここが空配列になる
        if (candidate_scales.length === 0) {
            return [__classPrivateFieldGet(this, _ChordProgression_scale_dictionary, "f").getId(Tonal_js_1.Scale_default.get("").name)];
        }
        return candidate_scales.map(scale => __classPrivateFieldGet(this, _ChordProgression_scale_dictionary, "f").getId(scale.name));
    }
    getChordIdSequence() {
        return this.lead_sheet_chords.map(chord => __classPrivateFieldGet(this, _ChordProgression_chord_dictionary, "f").getId((0, exports.getChord)(chord).name));
    }
    getDistanceOfStates(t1, t2, s1, s2) {
        const scale1 = Tonal_js_1.Scale_default.get(__classPrivateFieldGet(this, _ChordProgression_scale_dictionary, "f").getItem(s1));
        const scale2 = Tonal_js_1.Scale_default.get(__classPrivateFieldGet(this, _ChordProgression_scale_dictionary, "f").getItem(s2));
        const chord1 = (0, exports.getChord)(this.lead_sheet_chords[t1]);
        const chord2 = (0, exports.getChord)(this.lead_sheet_chords[t2]);
        if (scale1.empty) {
            console.warn("empty scale received");
            return 0;
        }
        if (scale2.empty) {
            console.warn("empty scale received");
            return 0;
        }
        return (0, TPS_js_1.getDistance)(new RomanChord(scale1, chord1), new RomanChord(scale2, chord2));
    }
    getMinimumPath() {
        const viterbi = (0, Graph_js_1.dynamicLogViterbi)(Math_js_1.Math.getZeros(24), // 12 音 x {-mol, -dur}
        this.getStatesOnTime.bind(this), this.getDistanceOfStates.bind(this), () => 0, this.getChordIdSequence(), true);
        // console.log(viterbi)
        const trace = viterbi.trace;
        return trace.map(e => e.map((id, i) => new RomanChord(Tonal_js_1.Scale_default.get(__classPrivateFieldGet(this, _ChordProgression_scale_dictionary, "f").getItem(id)), Tonal_js_1.Chord_default.get(this.lead_sheet_chords[i]))));
    }
}
exports.ChordProgression = ChordProgression;
_ChordProgression_chord_dictionary = new WeakMap(), _ChordProgression_scale_dictionary = new WeakMap(), _ChordProgression_instances = new WeakSet(), _ChordProgression_setDictionary = function _ChordProgression_setDictionary(lead_sheet_chords) {
    for (const chord_str of lead_sheet_chords) {
        const chord = (0, exports.getChord)(chord_str);
        const candidate_scales = (0, TPS_js_1.getKeysIncludeTheChord)(chord);
        for (const scale of candidate_scales) {
            __classPrivateFieldGet(this, _ChordProgression_chord_dictionary, "f").register(chord.name);
            __classPrivateFieldGet(this, _ChordProgression_scale_dictionary, "f").register(scale.name);
        }
        if (candidate_scales.length === 0) {
            __classPrivateFieldGet(this, _ChordProgression_scale_dictionary, "f").register(Tonal_js_1.Scale_default.get("").name);
        }
    }
};
//# sourceMappingURL=TonalEx.js.map