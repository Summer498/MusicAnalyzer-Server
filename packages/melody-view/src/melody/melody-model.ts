import { MelodyAnalysis, TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVCModel } from "@music-analyzer/view";

export class MelodyModel extends MVCModel implements TimeAndAnalyzedMelody {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly note: number;
  readonly head: { begin: number, end: number };
  readonly melody_analysis: MelodyAnalysis;
  constructor(melody: TimeAndAnalyzedMelody) {
    super();
    this.begin = melody.begin;
    this.end = melody.end;
    this.duration = melody.end - melody.begin;
    this.note = melody.note;
    this.head = melody.head;
    this.melody_analysis = melody.melody_analysis;
  }
}

