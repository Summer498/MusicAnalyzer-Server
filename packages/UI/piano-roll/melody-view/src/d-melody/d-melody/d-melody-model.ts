import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { MelodyAnalysis } from "./facade";
import { Time } from "./facade";

export class DMelodyModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly melody_analysis: MelodyAnalysis;
  constructor(e: SerializedTimeAndAnalyzedMelody) {
    this.time = e.time
    this.head = e.head;
    this.note = e.note;
    this.melody_analysis = e.melody_analysis;
  }
}
