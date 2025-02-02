import { NoteSize } from "./note-size";

// export const piano_roll_time_length = 5;  // 1 画面に収める曲の長さ[秒]
export class PianoRollTimeLength {
  static #value = 5;
  static #song_length = 0;
  static #piano_roll_ratio = 1;
  static get value() { return this.#value; }
  static onChange() {
    this.#value = this.#piano_roll_ratio * this.#song_length;
    NoteSize.onChange();
  }
  static setSongLength(song_length: number) {
    if (song_length <= 0) { throw new EvalError("song_length should be positive"); }
    this.#song_length = song_length;
    this.onChange();
  }
  static setRatio(piano_roll_ratio: number) {
    this.#piano_roll_ratio = piano_roll_ratio;
    this.onChange();
  }
}
