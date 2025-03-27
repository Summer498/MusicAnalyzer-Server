export { type Chord } from '@tonaljs/chord';
export { type Scale } from '@tonaljs/scale';
export { type IntervalName } from '@tonaljs/pitch-interval';
export { type IntervalLiteral } from '@tonaljs/pitch-interval';
export { type NoteLiteral } from "@tonaljs/pitch-note";
export { type Note } from "@tonaljs/pitch-note";
export { type Interval } from "@tonaljs/pitch-interval";

export { get as getChord } from "@tonaljs/chord";
export { get as getScale } from "@tonaljs/scale";
export { get as getRomanNumeral } from "@tonaljs/roman-numeral";
export { get as getNote } from "@tonaljs/note";
export { get as getInterval } from "@tonaljs/interval";
export { distance as intervalOf } from "@tonaljs/interval";
export { semitones as getSemitones } from "@tonaljs/interval";
export { chroma as getChroma } from "@tonaljs/note";
export { fromMidi as noteFromMidi } from "@tonaljs/note"
export { majorKey } from "@tonaljs/key";
export { minorKey } from "@tonaljs/key";

export { type ChordName } from "./src";
export { type ScaleName } from "./src";
export { getIntervalDegree } from "./src";