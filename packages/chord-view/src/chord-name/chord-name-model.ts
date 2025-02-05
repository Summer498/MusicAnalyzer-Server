import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { _Chord, Chord } from "@music-analyzer/tonal-objects";

export class ChordNameModel {
  readonly begin: number;
  readonly end: number;
  readonly tonic: string;
  readonly chord: Chord;
  readonly name: string;
  constructor(e: TimeAndRomanAnalysis){
    this.begin = e.begin;
    this.end = e.end;
    this.chord = _Chord.get(e.chord);
    this.tonic = this.chord.tonic || "";
    this.name = this.chord.name;
  }
}
