import { OctaveBlackBG } from "../octave-chunk";
import { OctaveWhiteBG } from "../octave-chunk";
import { Octave } from "./octave";

export class OctaveBG extends Octave {
  constructor(readonly oct: number) {
    super(
      `octave-BG-${oct}`,
      new OctaveWhiteBG(oct),
      new OctaveBlackBG(oct),
    )
  }
}
