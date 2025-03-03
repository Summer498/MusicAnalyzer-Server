import { MelodyAnalysis, TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVVM_Model } from "@music-analyzer/view";

export class MelodyModel extends MVVM_Model implements TimeAndAnalyzedMelody {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly note: number;
  readonly head: { begin: number, end: number };
  readonly melody_analysis: MelodyAnalysis;
  constructor(e: TimeAndAnalyzedMelody) {
    super();
    this.begin = e.begin;
    this.end = e.end;
    this.duration = e.end - e.begin;
    this.note = e.note;
    this.head = e.head;
    this.melody_analysis = e.melody_analysis;
  }
}

