import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { Time } from "@music-analyzer/time-and/src/time";
import { getNote } from "@music-analyzer/tonal-objects/src/note/get";
import { intervalOf } from "@music-analyzer/tonal-objects/src/interval/distance";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { MVVM_Model } from "@music-analyzer/view/src/mvc";

export class ChordNoteModel 
  extends MVVM_Model {
  readonly time: Time;
  readonly tonic: string;
  readonly type: string;
  readonly note: number;
  readonly note_name: string;
  readonly interval: string;
  constructor(
    e: TimeAndRomanAnalysis,
    chord: Chord,
    note: string,
    readonly oct: number,
  ) {
    super();
    this.time = e.time;
    this.tonic = chord.tonic!;
    this.type = chord.type;
    const _note = getNote(note);
    this.note = _note.chroma;
    this.note_name = _note.name;
    this.interval = intervalOf(this.tonic, _note);
  }
}
