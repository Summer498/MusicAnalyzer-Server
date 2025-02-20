import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { getRange } from "@music-analyzer/math";
import { _Chord } from "@music-analyzer/tonal-objects";
import { SvgCollection } from "@music-analyzer/view";
import { OctaveCount } from "@music-analyzer/view-parameters";
import { ChordNoteController } from "../chord-note/chord-note-controller";
import { ChordNoteModel } from "../chord-note/chord-note-model";

export class ChordNotesSeries extends SvgCollection {
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
