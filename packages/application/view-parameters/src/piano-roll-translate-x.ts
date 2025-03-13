import { CurrentTimeX } from "./current-time-x";
import { NoteSize } from "./note-size";
import { NowAt } from "./now-at";

export class PianoRollTranslateX {
  static #current_time: number;
  static #now_at: number;
  static #note_size: number;
  static #value: number;
  static get() {
    if (
      this.#current_time === CurrentTimeX.get()
      && this.#now_at === NowAt.get()
      && this.#note_size === NoteSize.get()
    ) { return this.#value; }
    this.#current_time = CurrentTimeX.get();
    this.#now_at = NowAt.get();
    this.#note_size = NoteSize.get();
    this.#value = CurrentTimeX.get() - NowAt.get() * NoteSize.get();
    return this.#value;
  }
}