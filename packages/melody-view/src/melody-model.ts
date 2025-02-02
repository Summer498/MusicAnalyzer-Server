import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";

export class MelodyModel {
  readonly begin: number;
  readonly end: number;
  readonly note?: number;
  readonly layer: number;
  constructor(melody: TimeAndMelodyAnalysis, layer: number) {
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.layer = layer;
  }
}

