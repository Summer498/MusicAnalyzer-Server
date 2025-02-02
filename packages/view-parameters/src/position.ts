import { mod } from "@music-analyzer/math";
import { PianoRollBegin } from "./piano-roll-begin";

const black_seed = [2, 4, 6, 9, 11];
const white_seed = [0, 1, 3, 5, 7, 8, 10];

export class BlackPosition {
  static get value() { return black_seed.map(e=>mod(e+PianoRollBegin.value,12)); }
}

export class WhitePosition {
  static get value() { return white_seed.map(e=>mod(e+PianoRollBegin.value,12)); }
}

