import { TimeAndAnalyzedMelody, MelodyAnalysis } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";

export class DMelodyModel {
  readonly time: Time;
  readonly head: Time;
  readonly melody_analysis: MelodyAnalysis;
  readonly note: number;
  constructor(d_melody: TimeAndAnalyzedMelody) {
    this.time = new Time(d_melody.begin, d_melody.end);
    this.head = new Time(d_melody.head.begin, d_melody.head.end);
    this.melody_analysis = d_melody.melody_analysis;
    this.note = d_melody.note;
  }
}
