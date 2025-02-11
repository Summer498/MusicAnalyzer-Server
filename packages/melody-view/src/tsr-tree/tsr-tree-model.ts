import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { MVCModel } from "@music-analyzer/view";

export class TSRModel extends MVCModel {
  readonly begin: number;
  readonly end: number;
  readonly head: { readonly begin: number, readonly end: number, readonly duration: number };
  readonly layer: number;
  constructor(
    melody: IMelodyModel,
    layer: number
  ) {
    super();
    this.begin = melody.begin;
    this.end = melody.end;
    this.layer = layer;
    this.head = {
      ...melody.head,
      w: melody.head.end - melody.head.begin
    };
  }
}