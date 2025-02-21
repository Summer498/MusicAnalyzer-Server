import { TimeAndAnalyzedMelody, MelodyAnalysis } from "@music-analyzer/melody-analyze";

export class DMelodyModel implements TimeAndAnalyzedMelody {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly head: { begin: number, end: number };
  readonly melody_analysis: MelodyAnalysis;
  readonly note: number;
  constructor(d_melody: TimeAndAnalyzedMelody) {
    this.begin = d_melody.begin;
    this.end = d_melody.end;
    this.duration = d_melody.end - d_melody.begin;
    this.head = d_melody.head;
    this.melody_analysis = d_melody.melody_analysis;
    this.note = d_melody.note;
  }
}
