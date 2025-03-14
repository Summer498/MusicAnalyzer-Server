import { PianoRollBegin, PianoRollEnd } from "./piano-roll";

const transposed = (e: number) => e - PianoRollBegin.get()

export class OctaveCount {
  static get() {
    return Math.ceil(-transposed(PianoRollEnd.get()) / 12);
  }
}
