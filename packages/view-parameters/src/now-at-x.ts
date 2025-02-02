import { NoteSize } from "./note-size";
import { NowAt } from "./now-at";

export class NowAtX {
  static #now_at: number;
  static #note_size: number;
  static #value: number;
  static get value() {
    if (
      this.#now_at === NowAt.value
      && this.#note_size === NoteSize.value
    ) { return this.#value; }

    this.#now_at = NowAt.value;
    this.#note_size = NoteSize.value;
    this.#value = NowAt.value* NoteSize.value;
    return this.#value;
  }
}