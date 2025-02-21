import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVCModel } from "@music-analyzer/view";

export class TSRModel extends MVCModel {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly head: { readonly begin: number, readonly end: number, readonly duration: number };
  readonly layer: number;
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer: number
  ) {
    super();
    this.begin = melody.begin;
    this.end = melody.end;
    this.duration = melody.end - melody.begin;
    this.layer = layer;
    this.head = {
      ...melody.head,
      duration: melody.head.end - melody.head.begin
    };
  }
}