import { MelodyAnalysis, IMelodyModel } from "@music-analyzer/melody-analyze";

export class MelodyModel implements IMelodyModel {
  readonly begin: number;
  readonly end: number;
  readonly note?: number;
  readonly head: {begin:number, end:number};
  readonly layer: number;
  readonly melody_analysis: MelodyAnalysis;
  constructor(melody: IMelodyModel, layer: number) {
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.head = melody.head;
    this.layer = layer;
    this.melody_analysis = melody.melody_analysis;
  }
}

