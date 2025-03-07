import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { _Chord } from "@music-analyzer/tonal-objects";
import { MVVM_Model } from "@music-analyzer/view";

export class ChordRomanModel extends MVVM_Model {
  readonly begin: number;
  readonly end: number;
  readonly tonic: string;
  readonly roman: string;
  constructor(e: TimeAndRomanAnalysis){
    super();
    this.begin = e.begin;
    this.end = e.end;
    this.roman = e.roman;
    this.tonic = _Chord.get(e.chord).tonic || "";
  }
}
