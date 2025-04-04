import { OctaveBlackKey } from "../octave-chunk";
import { OctaveWhiteKey } from "../octave-chunk";
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
