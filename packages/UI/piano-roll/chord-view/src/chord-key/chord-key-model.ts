import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { Time } from "@music-analyzer/time-and";
import { _Scale } from "@music-analyzer/tonal-objects";
import { MVVM_Model } from "@music-analyzer/view";

export class ChordKeyModel 
extends MVVM_Model {
  readonly time: Time;
  readonly tonic: string;
  readonly scale: string;
  constructor(e: TimeAndRomanAnalysis) {
    super();
    this.time = e.time;
    this.tonic = _Scale.get(e.scale).tonic!;
    this.scale = e.scale;
  }
}

