import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { getRange } from "@music-analyzer/math";
import { _Chord } from "@music-analyzer/tonal-objects";
import { SvgCollection } from "@music-analyzer/view";
import { OctaveCount } from "@music-analyzer/view-parameters";
import { ChordNoteController } from "./src/chord-note/chord-note-controller";
import { ChordNameController } from "./src/chord-name/chord-name-controller";
import { ChordRomanController } from "./src/chord-roman/chord-roman-controller";
import { ChordKeyController } from "./src/chord-key/chord-key-controller";
import { ChordNoteModel } from "./src/chord-note/chord-note-model";
import { ChordNameModel } from "./src/chord-name/chord-name-model";
import { ChordRomanModel } from "./src/chord-roman/chord-roman-model";
import { ChordKeyModel } from "./src/chord-key/chord-key-model";

export const getChordNotesController = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "chords",
  romans.map(e => {
    const chord = _Chord.get(e.chord);
    return getRange(0, OctaveCount.value)
      .map(oct => chord.notes
        .map(note => new ChordNoteController(new ChordNoteModel(e, chord, note, oct))
        )
      );
  }).flat(2)
);

export const getChordNamesController = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "chord-names",
  romans.map(e => new ChordNameController(new ChordNameModel(e)))
);

export const getChordRomansController = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "roman-names",
  romans.map(e => new ChordRomanController(new ChordRomanModel(e)))
);

export const getChordKeysController = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "key-names",
  romans.map(e => new ChordKeyController(new ChordKeyModel(e)))
);