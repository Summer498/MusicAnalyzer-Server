import { SerializedMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";

export class DMelodyModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly melody_analysis: SerializedMelodyAnalysis;
  constructor(e: SerializedTimeAndAnalyzedMelody) {
    this.time = e.time
    this.head = e.head;
    this.note = e.note;
    this.melody_analysis = e.melody_analysis;
  }
}
