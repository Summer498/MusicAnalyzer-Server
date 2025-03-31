import { IntervalName } from "./facade";
import { intervalOf } from "./facade";
import { NoteLiteral } from "./facade";

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