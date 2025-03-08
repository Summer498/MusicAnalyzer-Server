import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { Time } from "@music-analyzer/time-and";
import { _Chord } from "@music-analyzer/tonal-objects";
import { MVVM_Model } from "@music-analyzer/view";

export class ChordRomanModel extends MVVM_Model {
  readonly time: Time;
  readonly tonic: string;
  readonly roman: string;
  constructor(e: TimeAndRomanAnalysis) {
    super();
    this.time = e.time;
    this.roman = e.roman;
    this.tonic = _Chord.get(e.chord).tonic || "";
  }
}
