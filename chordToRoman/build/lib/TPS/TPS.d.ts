import { RomanChord } from "../TonalEx/TonalEx.js";
import { Chord } from "@tonaljs/chord";
import { Scale } from "@tonaljs/scale";
export declare const regionDistance: (src: Scale, dst: Scale) => number;
export declare const tonicDistance: (src: Chord, dst: Chord) => number;
export declare const getBasicSpace: (roman: RomanChord) => number[];
export declare const basicSpaceDistance: (src: RomanChord, dst: RomanChord) => number;
export declare const getDistance: (src_chord_string: RomanChord, dst_chord_string: RomanChord) => number;
export declare const getKeysIncludeTheChord: (chord: Chord) => Scale[];
/** @deprecated */
export declare const Key_quality: {
    major: number[];
    minor: number[];
};
/** @deprecated */
export declare const Chord_index: {
    none: {
        rmv: never[];
        add: never[];
    };
    seventh: {
        rmv: never[];
        add: number[];
    };
    ninth: {
        rmv: never[];
        add: number[];
    };
    added6: {
        rmv: number[];
        add: number[];
    };
    added46: {
        rmv: number[];
        add: number[];
    };
};
/** @deprecated */
export declare const Alt5: {
    dim5: number;
    none: number;
    aug5: number;
};
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
/**
 * @brief distance of BS in chord distance function
 * @param {number[]} src pitch class of source chord's BS
 * @param {number[]} dst pitch class of destination chord's BS
 * @return {number} count of additional pitch class in dst from src
 */
/** @deprecated */
/** @deprecated */
