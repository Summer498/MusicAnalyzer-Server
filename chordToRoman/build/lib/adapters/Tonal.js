"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.distance = exports.transpose = exports.coordToInterval = exports.interval = exports.tokenizeInterval = exports.coordToNote = exports.tokenizeNote = exports.note = exports.accToAlt = exports.altToAcc = exports.stepToLetter = exports.decode = exports.encode = exports.isPitch = exports.isNamed = exports.deprecate = exports.fillStr = exports.ScaleDictionary = exports.ChordDictionary = exports.PcSet = exports.Tonal = exports.Range = exports.Progression = exports.Note = exports.Midi = exports.Interval = exports.Collection = exports.AbcNotation = exports.Core = exports.Array = exports.TimeSignature_default = exports.ScaleType_default = exports.Scale_default = exports.RomanNumeral_default = exports.Pcset_default = exports.Mode_default = exports.Key_default = exports.DurationValue_default = exports.ChordType_default = exports.Chord_default = void 0;
var chord_1 = require("@tonaljs/chord");
Object.defineProperty(exports, "Chord_default", { enumerable: true, get: function () { return __importDefault(chord_1).default; } });
var chord_type_1 = require("@tonaljs/chord-type");
Object.defineProperty(exports, "ChordType_default", { enumerable: true, get: function () { return __importDefault(chord_type_1).default; } });
var duration_value_1 = require("@tonaljs/duration-value");
Object.defineProperty(exports, "DurationValue_default", { enumerable: true, get: function () { return __importDefault(duration_value_1).default; } });
var key_1 = require("@tonaljs/key");
Object.defineProperty(exports, "Key_default", { enumerable: true, get: function () { return __importDefault(key_1).default; } });
var mode_1 = require("@tonaljs/mode");
Object.defineProperty(exports, "Mode_default", { enumerable: true, get: function () { return __importDefault(mode_1).default; } });
var pcset_1 = require("@tonaljs/pcset");
Object.defineProperty(exports, "Pcset_default", { enumerable: true, get: function () { return __importDefault(pcset_1).default; } });
var roman_numeral_1 = require("@tonaljs/roman-numeral");
Object.defineProperty(exports, "RomanNumeral_default", { enumerable: true, get: function () { return __importDefault(roman_numeral_1).default; } });
var scale_1 = require("@tonaljs/scale");
Object.defineProperty(exports, "Scale_default", { enumerable: true, get: function () { return __importDefault(scale_1).default; } });
var scale_type_1 = require("@tonaljs/scale-type");
Object.defineProperty(exports, "ScaleType_default", { enumerable: true, get: function () { return __importDefault(scale_type_1).default; } });
var time_signature_1 = require("@tonaljs/time-signature");
Object.defineProperty(exports, "TimeSignature_default", { enumerable: true, get: function () { return __importDefault(time_signature_1).default; } });
var tonal_1 = require("tonal");
Object.defineProperty(exports, "Array", { enumerable: true, get: function () { return tonal_1.Array; } });
Object.defineProperty(exports, "Core", { enumerable: true, get: function () { return tonal_1.Core; } });
Object.defineProperty(exports, "AbcNotation", { enumerable: true, get: function () { return tonal_1.AbcNotation; } });
Object.defineProperty(exports, "Collection", { enumerable: true, get: function () { return tonal_1.Collection; } });
Object.defineProperty(exports, "Interval", { enumerable: true, get: function () { return tonal_1.Interval; } });
Object.defineProperty(exports, "Midi", { enumerable: true, get: function () { return tonal_1.Midi; } });
Object.defineProperty(exports, "Note", { enumerable: true, get: function () { return tonal_1.Note; } });
Object.defineProperty(exports, "Progression", { enumerable: true, get: function () { return tonal_1.Progression; } });
Object.defineProperty(exports, "Range", { enumerable: true, get: function () { return tonal_1.Range; } });
Object.defineProperty(exports, "Tonal", { enumerable: true, get: function () { return tonal_1.Tonal; } });
Object.defineProperty(exports, "PcSet", { enumerable: true, get: function () { return tonal_1.PcSet; } });
Object.defineProperty(exports, "ChordDictionary", { enumerable: true, get: function () { return tonal_1.ChordDictionary; } });
Object.defineProperty(exports, "ScaleDictionary", { enumerable: true, get: function () { return tonal_1.ScaleDictionary; } });
Object.defineProperty(exports, "fillStr", { enumerable: true, get: function () { return tonal_1.fillStr; } });
Object.defineProperty(exports, "deprecate", { enumerable: true, get: function () { return tonal_1.deprecate; } });
Object.defineProperty(exports, "isNamed", { enumerable: true, get: function () { return tonal_1.isNamed; } });
Object.defineProperty(exports, "isPitch", { enumerable: true, get: function () { return tonal_1.isPitch; } });
Object.defineProperty(exports, "encode", { enumerable: true, get: function () { return tonal_1.encode; } });
Object.defineProperty(exports, "decode", { enumerable: true, get: function () { return tonal_1.decode; } });
Object.defineProperty(exports, "stepToLetter", { enumerable: true, get: function () { return tonal_1.stepToLetter; } });
Object.defineProperty(exports, "altToAcc", { enumerable: true, get: function () { return tonal_1.altToAcc; } });
Object.defineProperty(exports, "accToAlt", { enumerable: true, get: function () { return tonal_1.accToAlt; } });
Object.defineProperty(exports, "note", { enumerable: true, get: function () { return tonal_1.note; } });
Object.defineProperty(exports, "tokenizeNote", { enumerable: true, get: function () { return tonal_1.tokenizeNote; } });
Object.defineProperty(exports, "coordToNote", { enumerable: true, get: function () { return tonal_1.coordToNote; } });
Object.defineProperty(exports, "tokenizeInterval", { enumerable: true, get: function () { return tonal_1.tokenizeInterval; } });
Object.defineProperty(exports, "interval", { enumerable: true, get: function () { return tonal_1.interval; } });
Object.defineProperty(exports, "coordToInterval", { enumerable: true, get: function () { return tonal_1.coordToInterval; } });
Object.defineProperty(exports, "transpose", { enumerable: true, get: function () { return tonal_1.transpose; } });
Object.defineProperty(exports, "distance", { enumerable: true, get: function () { return tonal_1.distance; } });
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
//# sourceMappingURL=Tonal.js.map