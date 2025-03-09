import { NoteLiteral } from "@music-analyzer/tonal-objects";

export class Monad {
  readonly symbol = "M";
  readonly notes: [NoteLiteral]
  constructor(note: NoteLiteral) {
    this.notes = [note]
  }
}