import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { Time } from "@music-analyzer/time-and/src/time";
import { getScale } from "@music-analyzer/tonal-objects/src/scale/get";
import { MVVM_Model } from "@music-analyzer/view/src/mvvm/model";

export class ChordKeyModel 
  extends MVVM_Model {
  readonly time: Time;
  readonly tonic: string;
  readonly scale: string;
  constructor(e: TimeAndRomanAnalysis) {
    super();
    this.time = e.time;
    this.tonic = getScale(e.scale).tonic!;
    this.scale = e.scale;
  }
}

