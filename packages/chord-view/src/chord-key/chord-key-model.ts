import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { _Scale } from "@music-analyzer/tonal-objects";
import { MVVM_Model } from "@music-analyzer/view";

export class ChordKeyModel extends MVVM_Model {
  readonly begin: number;
  readonly end: number;
  readonly tonic: string;
  readonly scale: string;
  constructor(e: TimeAndRomanAnalysis) {
    super();
    this.begin = e.begin;
    this.end = e.end;
    this.tonic = _Scale.get(e.scale).tonic!;
    this.scale = e.scale;
  }
}

