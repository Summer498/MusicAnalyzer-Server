import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";

export class DMelodyModel {
  readonly begin: number;
  readonly end: number;
  readonly note?: number;
  constructor(d_melody: TimeAndMelodyAnalysis) {
    this.begin = d_melody.begin;
    this.end = d_melody.end;
    this.note = d_melody.note;
  }
}
