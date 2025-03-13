import { _Interval } from "@music-analyzer/tonal-objects";
import { IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";

export class Dyad {
  readonly length = 2;
  readonly symbol = "Dyad";
  readonly notes: [NoteLiteral,NoteLiteral];
  readonly intervals: [IntervalName];
  constructor(prev: NoteLiteral, curr: NoteLiteral) {
    this.notes = [prev,curr];
    this.intervals = [_Interval.distance(prev, curr)];
  }
}