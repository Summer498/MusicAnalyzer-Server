import { CurrentTimeX } from "./current-time-x";
import { NoteSize } from "./note-size";
import { NowAt } from "./now-at";

export class PianoRollTranslateX {
  static #current_time: number;
  static #now_at: number;
  static #note_size: number;
  static #value: number;
  static get value() {
    if (
      this.#current_time === CurrentTimeX.value
      && this.#now_at === NowAt.get()
      && this.#note_size === NoteSize.value
    ) { return this.#value; }
    this.#current_time = CurrentTimeX.value;
    this.#now_at = NowAt.get();
    this.#note_size = NoteSize.value;
    this.#value = CurrentTimeX.value - NowAt.get() * NoteSize.value;
    return this.#value;
  }
}