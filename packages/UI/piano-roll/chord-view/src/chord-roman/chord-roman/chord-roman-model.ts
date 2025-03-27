import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { Time } from "@music-analyzer/time-and";
import { getChord } from "@music-analyzer/tonal-objects";
import { MVVM_Model } from "@music-analyzer/view/src/mvc";

export class ChordRomanModel 
  extends MVVM_Model {
  readonly time: Time;
  readonly tonic: string;
  readonly roman: string;
  constructor(e: TimeAndRomanAnalysis) {
    super();
    this.time = e.time;
    this.roman = e.roman;
    this.tonic = getChord(e.chord).tonic || "";
  }
}
