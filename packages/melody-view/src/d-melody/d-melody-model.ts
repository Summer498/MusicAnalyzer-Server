import { TimeAndAnalyzedMelody, MelodyAnalysis } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";

export class DMelodyModel {
  readonly time: Time;
  readonly head: Time;
  readonly melody_analysis: MelodyAnalysis;
  readonly note: number;
  constructor(e: TimeAndAnalyzedMelody) {
    this.time = new Time(e.begin, e.end);
    this.head = e.head;
    this.melody_analysis = e.melody_analysis;
    this.note = e.note;
  }
}
