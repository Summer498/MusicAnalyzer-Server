import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVVM_Model } from "@music-analyzer/view";

export class ReductionModel extends MVVM_Model {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly head: { readonly begin: number, readonly end: number, readonly duration: number };
  constructor(
    melody: TimeAndAnalyzedMelody,
    readonly layer: number,
  ) {
    super();
    this.begin = melody.begin;
    this.end = melody.end;
    this.duration = melody.end - melody.begin;
    
    this.head = {
      ...melody.head,
      duration: melody.head.end - melody.head.begin
    };
  }
}