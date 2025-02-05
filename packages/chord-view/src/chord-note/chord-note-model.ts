import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { _Note, Chord } from "@music-analyzer/tonal-objects";

export class ChordNoteModel {
  readonly begin: number;
  readonly end: number;
  readonly tonic: string;
  readonly type: string;
  readonly note: number;
  readonly oct: number;
  constructor(
    e: TimeAndRomanAnalysis,
    chord: Chord,
    note: string,
    oct: number
  ) {
    this.begin = e.begin;
    this.end = e.end;
    this.tonic = chord.tonic!;
    this.type = chord.type;
    this.note = _Note.chroma(note);
    this.oct = oct;
  }
}
