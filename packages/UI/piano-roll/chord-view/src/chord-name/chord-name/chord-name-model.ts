import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { Time } from "@music-analyzer/time-and/src/time";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { getChord } from "@music-analyzer/tonal-objects/src/chord/get";
import { MVVM_Model } from "@music-analyzer/view/src/mvc";

export class ChordNameModel 
  extends MVVM_Model {
  readonly time: Time;
  readonly tonic: string;
  readonly chord: Chord;
  readonly name: string;
  constructor(e: TimeAndRomanAnalysis){
    super();
    this.time = e.time;
    this.chord = getChord(e.chord);
    this.tonic = this.chord.tonic || "";
    this.name = this.chord.name;
  }
}
