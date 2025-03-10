import { PianoRollRatio } from "./piano-roll-ratio";
import { SongLength } from "../song-length";

export class PianoRollTimeLength {
  static #song_length: number;
  static #piano_roll_ratio: number;
  static #value: number;
  static get value() {
    if (
      this.#song_length === SongLength.value
      && this.#piano_roll_ratio === PianoRollRatio.value
    ) { return this.#value; }

    this.#song_length = SongLength.value;
    this.#piano_roll_ratio = PianoRollRatio.value;
    this.#value = this.#piano_roll_ratio * this.#song_length;
    return this.#value;
  }
}
