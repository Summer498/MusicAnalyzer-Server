//*
export { Chord } from "@tonaljs/chord";
export { ChordType } from "@tonaljs/chord-type";
export { DurationValue } from "@tonaljs/duration-value";
export { Key } from "@tonaljs/key";
export { Mode } from "@tonaljs/mode";
export { Pcset } from "@tonaljs/pcset";
export { RomanNumeral } from "@tonaljs/roman-numeral";
export { Scale } from "@tonaljs/scale";
export { ScaleType } from "@tonaljs/scale-type";
export { TimeSignature } from "@tonaljs/time-signature";

export { default as Chord_default } from "@tonaljs/chord";
export { default as ChordType_default } from "@tonaljs/chord-type";
export { default as DurationValue_default } from "@tonaljs/duration-value";
export { default as Key_default } from "@tonaljs/key";
export { default as Mode_default } from "@tonaljs/mode";
export { default as Pcset_default } from "@tonaljs/pcset";
export { default as RomanNumeral_default } from "@tonaljs/roman-numeral";
export { default as Scale_default } from "@tonaljs/scale";
export { default as ScaleType_default } from "@tonaljs/scale-type";
export { default as TimeSignature_default } from "@tonaljs/time-signature";

export {
    Array,
    Core,
    AbcNotation,
    Collection,
    Interval,
    Midi,
    Note,
    Progression,
    Range,
    Tonal,
    PcSet,
    ChordDictionary,
    ScaleDictionary,
    fillStr,
    deprecate,
    Named,
    NamedFound,
    NotFound,
    isNamed,
    Direction,
    PitchClassCoordinates,
    NoteCoordinates,
    IntervalCoordinates,
    PitchCoordinates,
    Pitch,
    isPitch,
    encode,
    decode,
    NoteWithOctave,
    PcName,
    NoteName,
    NoteLiteral,
    NoNote,
    stepToLetter,
    altToAcc,
    accToAlt,
    note,
    tokenizeNote,
    coordToNote,
    IntervalName,
    IntervalLiteral,
    NoInterval,
    tokenizeInterval,
    interval,
    coordToInterval,
    transpose,
    distance,
} from "tonal";

//*/

// --------------------------------------------------

/*
export interface Named {
    readonly name: string;
}
export declare type PcsetChroma = string;
export declare type IntervalName = string;
export interface Pcset extends Named {
    readonly empty: boolean;
    readonly setNum: number;
    readonly chroma: PcsetChroma;
    readonly normalized: PcsetChroma;
    readonly intervals: IntervalName[];
}
export declare type ChordQuality = "Major" | "Minor" | "Augmented" | "Diminished" | "Unknown";
export interface ChordType extends Pcset {
    name: string;
    quality: ChordQuality;
    aliases: string[];
}
declare type Fraction = [number, number];
export interface DurationValue {
    empty: boolean;
    value: number;
    name: string;
    fraction: Fraction;
    shorthand: string;
    dots: string;
    names: string[];
}
export interface Key {
    readonly type: "major" | "minor";
    readonly tonic: string;
    readonly alteration: number;
    readonly keySignature: string;
}
export interface Mode extends Pcset {
    readonly name: string;
    readonly modeNum: number;
    readonly alt: number;
    readonly triad: string;
    readonly seventh: string;
    readonly aliases: string[];
}
export declare type Direction = 1 | -1;
export interface Pitch {
    readonly step: number;
    readonly alt: number;
    readonly oct?: number;
    readonly dir?: Direction;
}
export declare type NoteWithOctave = string;
export declare type PcName = string;
export declare type NoteName = NoteWithOctave | PcName;
export declare type NoteLiteral = NoteName | Pitch | Named;
export interface Chord extends ChordType {
    tonic: string | null;
    type: string;
    root: string;
    rootDegree: number;
    symbol: string;
    notes: NoteName[];
}
export interface RomanNumeral extends Pitch, Named {
    readonly empty: boolean;
    readonly roman: string;
    readonly interval: string;
    readonly acc: string;
    readonly chordType: string;
    readonly major: boolean;
    readonly dir: 1;
}
export interface ScaleType extends Pcset {
    readonly name: string;
    readonly aliases: string[];
}
export interface Scale extends ScaleType {
    tonic: string | null;
    type: string;
    notes: NoteName[];
}
export interface ScaleType extends Pcset {
    readonly name: string;
    readonly aliases: string[];
}
export declare type ValidTimeSignature = {
    readonly empty: false;
    readonly name: string;
    readonly upper: number | number[];
    readonly lower: number;
    readonly type: "simple" | "compound" | "irregular";
    readonly additive: number[];
};
export declare type InvalidTimeSignature = {
    readonly empty: true;
    readonly name: "";
    readonly upper: undefined;
    readonly lower: undefined;
    readonly type: undefined;
    readonly additive: [];
};
export declare type TimeSignature = ValidTimeSignature | InvalidTimeSignature;

interface ICore{
    Chord:any,
    ChordType:any,
    DurationValue:any,
    Key:any,
    Mode:any,
    Pcset:any,
    RomanNumeral:any,
    Scale:any,
    ScaleType:any,
    TimeSignature:any,
    ChordDictionary: any,
    
    Note:any,
    Interval:any,
    Midi:any,
    Progression:any,        
}

declare const Core: ICore;

interface TonalWindow extends Window{
    Tonal: typeof Core;
}

declare let window: TonalWindow;
declare let globalThis: TonalWindow;
if (window.Tonal === undefined) { throw ReferenceError('Tonal.js を HTML からインポートする必要があります. HTML ファイル内に, "<script src="https://cdn.jsdelivr.net/npm/@tonaljs/tonal/browser/tonal.min.js"></script>" と記述してください.'); }
export const Tonal = globalThis.Tonal;  // eslint-disable-line no-undef

export const Chord_default = Tonal.Chord;
export const ChordType_default = Tonal.ChordType;
export const DurationValue_default = Tonal.DurationValue;
export const Key_default = Tonal.Key;
export const Mode_default = Tonal.Mode;
export const Pcset_default = Tonal.Pcset;
export const RomanNumeral_default = Tonal.RomanNumeral;
export const Scale_default = Tonal.Scale;
export const ScaleType_default = Tonal.ScaleType;
export const TimeSignature_default = Tonal.TimeSignature;
export const ChordDictionary = Tonal.ChordDictionary;

export const Note = Tonal.Note;
export const Interval = Tonal.Interval;
export const Midi = Tonal.Midi;
export const Progression = Tonal.Progression;

//*/
