import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { _Chord, Chord } from "@music-analyzer/tonal-objects";
import { MVVM_Model } from "@music-analyzer/view";

export class ChordNameModel extends MVVM_Model {
  readonly begin: number;
  readonly end: number;
  readonly tonic: string;
  readonly chord: Chord;
  readonly name: string;
  constructor(e: TimeAndRomanAnalysis){
    super();
    this.begin = e.begin;
    this.end = e.end;
    this.chord = _Chord.get(e.chord);
    this.tonic = this.chord.tonic || "";
    this.name = this.chord.name;
  }
}
