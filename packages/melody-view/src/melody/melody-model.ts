import { MelodyAnalysis, TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";
import { MVVM_Model } from "@music-analyzer/view";

export class MelodyModel extends MVVM_Model {
  readonly time: Time;
  readonly note: number;
  readonly head: Time;
  readonly melody_analysis: MelodyAnalysis;
  constructor(e: TimeAndAnalyzedMelody) {
    super();
    this.time = new Time(e.begin, e.end);
    this.note = e.note;
    this.head = new Time(e.head.begin, e.head.end);
    this.melody_analysis = e.melody_analysis;
  }
}

