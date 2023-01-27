import { Chord, NoteLiteral, Scale } from "../adapters/Tonal.js";
export declare class RomanChord {
    #private;
    constructor(scale: Scale, chord: Chord);
    get scale(): Scale;
    get chord(): Chord;
    get roman(): string;
}
export declare const getIntervalDegree: (src: NoteLiteral, dst: NoteLiteral) => number;
export declare const getNonNullableChroma: (note: NoteLiteral) => number;
export declare const getChord: (chord_string: string) => Chord;
export declare class ChordProgression {
    #private;
    lead_sheet_chords: string[];
    debug(): {
        lead_sheet_chords: string[];
        chord_dict: string[];
        scale_dict: string[];
    };
    constructor(lead_sheet_chords: string[]);
    getStatesOnTime(t: number): number[];
    getChordIdSequence(): number[];
    getDistanceOfStates(t1: number, t2: number, s1: number, s2: number): number;
    getMinimumPath(): RomanChord[][];
}
