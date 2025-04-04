import { IntervalName } from "@music-analyzer/tonal-objects";
import { intervalOf } from "@music-analyzer/tonal-objects";
import { NoteLiteral } from "@music-analyzer/tonal-objects";

export class Dyad {
  readonly length = 2;
  readonly symbol = "Dyad";
  readonly notes: [NoteLiteral, NoteLiteral];
  readonly intervals: [IntervalName];
  constructor(prev: NoteLiteral, curr: NoteLiteral) {
    this.notes = [prev, curr];
    this.intervals = [intervalOf(prev, curr)];
  }
}