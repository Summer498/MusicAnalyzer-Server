import { Archetype } from "@music-analyzer/irm";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVVM_Model } from "@music-analyzer/view";

export class ReductionModel extends MVVM_Model {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly head: { readonly begin: number, readonly end: number, readonly duration: number };
  readonly archetype: Archetype;
  constructor(
    readonly layer: number,
    e: TimeAndAnalyzedMelody,
  ) {
    super();
    this.begin = e.begin;
    this.end = e.end;
    this.duration = e.end - e.begin;
    
    this.head = {
      ...e.head,
      duration: e.head.end - e.head.begin
    };
    this.archetype = e.melody_analysis.implication_realization;
  }
}