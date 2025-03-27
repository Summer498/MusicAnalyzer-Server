import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { MelodyAnalysis } from "@music-analyzer/melody-analyze/src/melody-analysis";
import { Time } from "@music-analyzer/time-and";

export class DMelodyModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly melody_analysis: MelodyAnalysis;
  constructor(e: TimeAndAnalyzedMelody) {
    this.time = e.time
    this.head = e.head;
    this.note = e.note;
    this.melody_analysis = e.melody_analysis;
  }
}
