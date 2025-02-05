import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { getRange } from "@music-analyzer/math";
import { _Chord } from "@music-analyzer/tonal-objects";
import { SvgCollection } from "@music-analyzer/view";
import { OctaveCount } from "@music-analyzer/view-parameters";
import { ChordNoteController } from "./src/chord-note/chord-note-controller";
import { ChordNameController } from "./src/chord-name/chord-name-controller";
import { ChordRomanController } from "./src/chord-roman/chord-roman-controller";
import { ChordKeyController } from "./src/chord-key/chord-key-controller";

export const getChordNotesSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "chords",
  romans.map(e => {
    const chord = _Chord.get(e.chord);
    return getRange(0, OctaveCount.value)
      .map(oct => chord.notes
        .map(note => new ChordNoteController(e, chord, note, oct)
        )
      );
  }).flat(2)
);

export const getChordNamesSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "chord-names",
  romans.map(e => new ChordNameController(e))
);

export const getChordRomansSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "roman-names",
  romans.map(e => new ChordRomanController(e))
);

export const getChordKeysSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "key-names",
  romans.map(e => new ChordKeyController(e))
);