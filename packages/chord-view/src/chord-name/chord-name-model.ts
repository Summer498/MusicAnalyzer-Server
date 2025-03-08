import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { Time } from "@music-analyzer/time-and";
import { _Chord, Chord } from "@music-analyzer/tonal-objects";
import { MVVM_Model } from "@music-analyzer/view";

export class ChordNameModel extends MVVM_Model {
  readonly time: Time;
  readonly tonic: string;
  readonly chord: Chord;
  readonly name: string;
  constructor(e: TimeAndRomanAnalysis){
    super();
    this.time = new Time(e.begin, e.end);
    this.chord = _Chord.get(e.chord);
    this.tonic = this.chord.tonic || "";
    this.name = this.chord.name;
  }
}
