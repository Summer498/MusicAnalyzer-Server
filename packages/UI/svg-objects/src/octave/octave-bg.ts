import { OctaveBlackBG } from "../octave-chunk/octave-black-bg";
import { OctaveWhiteBG } from "../octave-chunk/octave-white-bg";
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
