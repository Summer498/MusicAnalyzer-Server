import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { _Chord } from "@music-analyzer/tonal-objects";

export class ChordRomanModel {
  readonly begin: number;
  readonly end: number;
  readonly tonic: string;
  readonly roman: string;
  constructor(e: TimeAndRomanAnalysis){
    this.begin = e.begin;
    this.end = e.end;
    this.roman = e.roman;
    this.tonic = _Chord.get(e.chord).tonic || "";
  }
}
