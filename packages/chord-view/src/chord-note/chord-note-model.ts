import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { _Note, Chord } from "@music-analyzer/tonal-objects";
import { MVCModel } from "@music-analyzer/view";

export class ChordNoteModel extends MVCModel {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly tonic: string;
  readonly type: string;
  readonly note: number;
  constructor(
    e: TimeAndRomanAnalysis,
    chord: Chord,
    note: string,
    readonly oct: number,
  ) {
    super();
    this.begin = e.begin;
    this.end = e.end;
    this.duration = e.end - e.begin;
    this.tonic = chord.tonic!;
    this.type = chord.type;
    this.note = _Note.chroma(note);
  }
}
