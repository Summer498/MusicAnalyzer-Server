import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { getRange } from "@music-analyzer/math";
import { _Chord } from "@music-analyzer/tonal-objects";
import { SvgCollection__old } from "@music-analyzer/view";
import { OctaveCount } from "@music-analyzer/view-parameters";
import { ChordNoteSVG } from "./src/chord-note/chord-note";
import { ChordNameSVG } from "./src/chord-name/chord-name";
import { ChordRomanSVG } from "./src/chord-roman/chord-roman";
import { ChordKeySVG } from "./src/chord-key/chord-key";

export const getChordNotesSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection__old(
  "chords",
  romans.map(e => {
    const chord = _Chord.get(e.chord);
    return getRange(0, OctaveCount.value).map(oct => chord.notes.map(note => new ChordNoteSVG(e, chord, note, oct)));
  }).flat(2)
);

export const getChordNamesSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection__old(
  "chord-names",
  romans.map(e => new ChordNameSVG(e))
);

export const getChordRomansSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection__old(
  "roman-names",
  romans.map(e => new ChordRomanSVG(e))
);

export const getChordKeysSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection__old(
  "key-names",
  romans.map(e => new ChordKeySVG(e))
);