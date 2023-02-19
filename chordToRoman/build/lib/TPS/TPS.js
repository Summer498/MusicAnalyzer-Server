"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alt5 = exports.Chord_index = exports.Key_quality = exports.getKeysIncludeTheChord = exports.getDistance = exports.basicSpaceDistance = exports.getBasicSpace = exports.tonicDistance = exports.regionDistance = void 0;
const Math_js_1 = require("../Math/Math.js");
const TonalEx_js_1 = require("../TonalEx/TonalEx.js");
const stdlib_js_1 = require("../StdLib/stdlib.js");
const scale_1 = __importDefault(require("@tonaljs/scale"));
const key_1 = __importDefault(require("@tonaljs/key"));
const note_1 = __importDefault(require("@tonaljs/note"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const regionDistanceInChromaNumber = (src, dst) => {
    return Math_js_1.Math.abs(Math_js_1.Math.mod((dst - src) * 7 + 6, 12) - 6);
};
const regionDistance = (src, dst) => {
    const src_chroma = (0, TonalEx_js_1.getNonNullableChroma)((0, stdlib_js_1.assertNonNullable)(src.tonic));
    const dst_chroma = (0, TonalEx_js_1.getNonNullableChroma)((0, stdlib_js_1.assertNonNullable)(dst.tonic));
    const region_dist = regionDistanceInChromaNumber(src_chroma, dst_chroma);
    return region_dist;
};
exports.regionDistance = regionDistance;
const tonicDistanceInChromaNumber = (src, dst) => {
    return Math_js_1.Math.abs(Math_js_1.Math.mod((dst - src) * 3 + 3, 7) - 3);
};
const tonicDistance = (src, dst) => {
    const interval = (0, TonalEx_js_1.getIntervalDegree)((0, stdlib_js_1.assertNonNullable)(src.tonic), (0, stdlib_js_1.assertNonNullable)(dst.tonic));
    const dist_in_circle_of_3rd = Math_js_1.Math.mod((interval - 1) * 3, 7);
    return Math_js_1.Math.min(dist_in_circle_of_3rd, 7 - dist_in_circle_of_3rd);
};
exports.tonicDistance = tonicDistance;
const getTonicChroma = (chord) => {
    const tonic = (0, stdlib_js_1.assertNonNullable)(chord.tonic);
    return [(0, TonalEx_js_1.getNonNullableChroma)(tonic)];
};
const getPowerChroma = (chord) => {
    const tonic = (0, stdlib_js_1.assertNonNullable)(chord.tonic);
    const fifths = chord.notes
        .filter(note => (0, TonalEx_js_1.getIntervalDegree)(tonic, note) == 5);
    new stdlib_js_1.Assertion(fifths.length == 1)
        .onFailed(() => {
        console.log(`received:`);
        console.log(chord.notes);
        throw new Error("received chord must have just one 5th code.");
    });
    return [tonic, fifths[0]].map(note => (0, TonalEx_js_1.getNonNullableChroma)(note));
};
const getChordChroma = (chord) => {
    return chord.notes.map(note => (0, TonalEx_js_1.getNonNullableChroma)(note));
};
const getScaleChroma = (roman) => {
    // TODO: 借用和音に伴いスケール構成音を変異させる
    new stdlib_js_1.Assertion(Math_js_1.Math.isSubSet(roman.chord.notes.map(note => (0, TonalEx_js_1.getNonNullableChroma)(note)), roman.scale.notes.map(note => (0, TonalEx_js_1.getNonNullableChroma)(note))))
        .onFailed(() => {
        console.log(`received:`);
        console.log(roman);
        throw new stdlib_js_1.NotImplementedError("借用和音はまだ実装されていません. 入力ローマ数字コードは, コード構成音がスケール内に収まるようにしてください.");
    });
    return roman.scale.notes.map(note => (0, TonalEx_js_1.getNonNullableChroma)(note));
};
const getBasicSpace = (roman) => {
    new stdlib_js_1.Assertion(!roman.scale.empty)
        .onFailed(() => {
        console.log(`received:`);
        console.log(roman.scale);
        throw new Error("scale must not be empty");
    });
    new stdlib_js_1.Assertion(!roman.chord.empty)
        .onFailed(() => {
        console.log(`received:`);
        console.log(roman.chord);
        throw new Error("chord must not be empty");
    });
    const basic_space = Math_js_1.Math.vSum(Math_js_1.Math.getOnehot(getTonicChroma(roman.chord), 12), Math_js_1.Math.getOnehot(getPowerChroma(roman.chord), 12), Math_js_1.Math.getOnehot(getChordChroma(roman.chord), 12), Math_js_1.Math.getOnehot(getScaleChroma(roman), 12));
    return basic_space;
};
exports.getBasicSpace = getBasicSpace;
const basicSpaceDistance = (src, dst) => {
    const src_bs = (0, exports.getBasicSpace)(src);
    const dst_bs = (0, exports.getBasicSpace)(dst);
    const incremented = Math_js_1.Math.vSub(dst_bs, src_bs)
        .filter(e => e > 0);
    return Math_js_1.Math.totalSum(incremented);
    // TODO: 遠隔調の例外処理 (がそもそも必要なのか?)
};
exports.basicSpaceDistance = basicSpaceDistance;
const getDistance = (src_chord_string, dst_chord_string) => {
    const src = src_chord_string;
    const dst = dst_chord_string;
    const region_dist = (0, exports.regionDistance)(src.scale, dst.scale);
    const tonic_dist = (0, exports.tonicDistance)(src.chord, dst.chord);
    const basic_space_dist = (0, exports.basicSpaceDistance)(src, dst);
    return region_dist + tonic_dist + basic_space_dist; //dummy
};
exports.getDistance = getDistance;
const c_minor = key_1.default.minorKey("C").natural;
const isKeyIncludesTheChord = (key, chord) => {
    const key_note_chromas = key.scale.map((note) => note_1.default.chroma(note));
    const chord_note_chromas = chord.notes.map(note => note_1.default.chroma(note));
    return Math_js_1.Math.isSuperSet(key_note_chromas, chord_note_chromas);
};
// 最も尤もらしいコード進行を見つける
const major_keys = ['Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B',].map(key => scale_1.default.get(key + " major"));
const minor_keys = ['Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#',].map(key => scale_1.default.get(key + " minor"));
const keys = major_keys.concat(minor_keys);
const chroma2symbol = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// TODO: minor Major 7 を受け取ることがあるので, 任意のキーを候補として使えるようにする. 
const getKeysIncludeTheChord = (chord) => {
    const keys_includes_the_chord = chroma2symbol
        .flatMap(symbol => [key_1.default.majorKey(symbol), key_1.default.minorKey(symbol).natural])
        .filter(key => isKeyIncludesTheChord(key, chord))
        .map(key => scale_1.default.get(key.chordScales[0]));
    return keys_includes_the_chord;
};
exports.getKeysIncludeTheChord = getKeysIncludeTheChord;
const getMostLikelyChordProgression = (chord_progression) => {
    /*
    const possible_keys = chord_progression.forEach(chord => getKeyIncludesTheChord(chord));
    return undefined;
    */
};
// c-spell:disable
/* eslint-disable deprecation/deprecation */
// BEGIN: 古いやつ
/** @deprecated */
exports.Key_quality = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10]
};
/*
export const Chroma = {
    Cflat: 11, C: 0, Csharp: 1,
    Dflat: 1, D: 2, Dsharp: 3,
    Eflat: 3, E: 4, Esharp: 5,
    Fflat: 4, F: 5, Fsharp: 6,
    Gflat: 6, G: 7, Gsharp: 8,
    Aflat: 8, A: 9, Asharp: 10,
    Bflat: 10, B: 11, Bsharp: 0,
};
*/
/** @deprecated */
exports.Chord_index = {
    none: { rmv: [], add: [] },
    seventh: { rmv: [], add: [7] },
    ninth: { rmv: [], add: [7, 9] },
    added6: { rmv: [5], add: [6] },
    added46: { rmv: [3, 5], add: [4, 6] },
};
/** @deprecated */
exports.Alt5 = {
    dim5: -1,
    none: 0,
    aug5: 1
};
//TODO: +46, +6 要る?
/**
 * @brief get Basic Space of chord
 * @param {number} key key in which chord is (key is like Chroma.Fsharp)
 * @param {number[]} key_quality key in which chord is (key_quality is like Key_quality.major)
 * @param {number} degree degree of chord in the key (degree is in {1,2,...,7})
 * @param {{rmv:(number|never)[],add:(number|never)[]}} chord_index indexes of chord: one of {0, 6, 7, 9} (default:0)
 * @param {number} alt5 of chord in the key: one of {-1, 0, 1} (default:0)
 * @return {number[]} Basic Space of chord
 */
/** @deprecated */
/*
export const oldGetBasicSpace = (
    key: number,
    key_quality: number[],
    degree: number,
    chord_index: { rmv: (number | never)[], add: (number | never)[] } = Chord_index.none,
    alt5 = 0
) => {
    //TODO:
    console.assert(degree !== undefined);
    const d = degree;
    console.log(key_quality);
    console.log(Math.v_add(key_quality, key));
    console.log(Math.v_mod(Math.v_add(key_quality, key), 12));
    const s = Math.v_mod(Math.v_add(key_quality, key), 12);
    s[4] += alt5;

    const code_tone = Math.removeFromArray(Math.genArr(3, i => 2 * i + 1), chord_index.rmv).concat(chord_index.add);
    const c = Math.v_get(s, Math.v_mod(Math.v_add(code_tone, d - 2), 7));
    const leveld = Math.getOnehot(s, 12);
    const levelc = Math.getOnehot(c, 12);
    const levelb = Math.getOnehot([c[0], c[2]], 12);
    const levela = Math.getOnehot([c[0]], 12);
    return Math.v_sum(leveld, levelc, levelb, levela);
};
*/
/**
 * @brief distance of BS in chord distance function
 * @param {number[]} src pitch class of source chord's BS
 * @param {number[]} dst pitch class of destination chord's BS
 * @return {number} count of additional pitch class in dst from src
 */
/** @deprecated */
/*
export const basicSpaceDist = (src: number[], dst: number[]) => {
    let sum = 0;
    Math.v_sub(dst, src).map(e => { sum += Math.max(0, e); return sum; });
    return sum;
};
*/
/** @deprecated */
/*
export const chordDist = (
    src: {
        key: number,
        quality: number[],
        degree: number,
        indexes: { rmv: (number | never)[], add: (number | never)[] }
        alt5: number
    },
    dst: {
        key: number,
        quality: number[],
        degree: number,
        indexes: { rmv: (number | never)[], add: (number | never)[] }
        alt5: number
    }
) => {
    // TODO: 遠隔調の例外処理
    return regionDistanceInChromaNumber(src.key, dst.key)
        + tonicDistanceInChromaNumber(src.degree, dst.degree)
        + basicSpaceDist(
            oldGetBasicSpace(src.key, src.quality, src.degree, src.indexes, src.alt5),
            oldGetBasicSpace(dst.key, dst.quality, dst.degree, dst.indexes, dst.alt5)
        );
};
*/
// TODO: もう少し Tonaljs friendly に書く
// END: 古いやつ
//# sourceMappingURL=TPS.js.map