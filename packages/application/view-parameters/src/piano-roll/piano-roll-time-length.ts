import { PianoRollRatio } from "./piano-roll-ratio";
import { SongLength } from "../song-length";

export class PianoRollTimeLength {
  static #song_length: number;
  static #piano_roll_ratio: number;
  static #value: number;
  static get() {
    if (
      this.#song_length === SongLength.get()
      && this.#piano_roll_ratio === PianoRollRatio.get()
    ) { return this.#value; }

    this.#song_length = SongLength.get();
    this.#piano_roll_ratio = PianoRollRatio.get();
    this.#value = this.#piano_roll_ratio * this.#song_length;
    return this.#value;
  }
}
