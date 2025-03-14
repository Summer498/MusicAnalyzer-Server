import { NoteLiteral } from "@music-analyzer/tonal-objects";

export class Monad {
  readonly length = 1;
  readonly symbol = "M";
  readonly notes: [NoteLiteral]
  constructor(note: NoteLiteral) {
    this.notes = [note]
  }
}