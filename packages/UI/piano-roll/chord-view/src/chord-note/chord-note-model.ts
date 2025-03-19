import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { Time } from "@music-analyzer/time-and";
import { _Interval, _Note, Chord } from "@music-analyzer/tonal-objects";
import { MVVM_Model } from "@music-analyzer/view";

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
    const _note = _Note.get(note);
    this.note = _note.chroma;
    this.note_name = _note.name;
    this.interval = _Interval.distance(this.tonic, _note);
  }
}
