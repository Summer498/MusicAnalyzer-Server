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

export class ChordNotesGroup extends SvgCollection {
  constructor(
    romans: TimeAndRomanAnalysis[]
  ) {
    const children = romans.map(roman => {
      const chord = _Chord.get(roman.chord);
      return getRange(0, OctaveCount.value)
        .map(oct => chord.notes
          .map(note => new ChordNoteController(new ChordNoteModel(roman, chord, note, oct))
          )
        );
    }).flat(2);
    super(children);
    this.svg.id = "chords";
  }
}

export class ChordNameGroup extends SvgCollection {
  constructor(
    romans: TimeAndRomanAnalysis[]
  ){
    const children = romans.map(e => new ChordNameController(new ChordNameModel(e)));
    super(children);
    this.svg.id = "chord-names";
  }
}

export class ChordRomanGroup extends SvgCollection {
  constructor(
    romans: TimeAndRomanAnalysis[]
  ){
    const children = romans.map(e => new ChordRomanController(new ChordRomanModel(e)));
    super(children);
    this.svg.id = "roman-names";
  }
} 

export class CHordKeyGroup extends SvgCollection{
  constructor(
    romans: TimeAndRomanAnalysis[]
  ){
    const children = romans.map(e => new ChordKeyController(new ChordKeyModel(e)));
    super(children);
    this.svg.id = "key-names";
  }
}
