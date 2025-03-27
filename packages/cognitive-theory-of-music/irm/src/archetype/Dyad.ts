import { IntervalName } from "@music-analyzer/tonal-objects/src/interval/interval-name";
import { intervalOf } from "@music-analyzer/tonal-objects/src/interval/distance";
import { NoteLiteral } from "@music-analyzer/tonal-objects/src/note/note-literal";

export class Dyad {
  readonly length = 2;
  readonly symbol = "Dyad";
  readonly notes: [NoteLiteral,NoteLiteral];
  readonly intervals: [IntervalName];
  constructor(prev: NoteLiteral, curr: NoteLiteral) {
    this.notes = [prev,curr];
    this.intervals = [intervalOf(prev, curr)];
  }
}