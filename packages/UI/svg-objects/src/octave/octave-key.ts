import { OctaveBlackKey } from "../octave-chunk/octave-black-key";
import { OctaveWhiteKey } from "../octave-chunk/octave-white-key";
import { Octave } from "./octave";

export class OctaveKey extends Octave {
  constructor(readonly oct: number) {
    super(
      `octave-key-${oct}`,
      new OctaveWhiteKey(oct),
      new OctaveBlackKey(oct),
    )
  }
}
