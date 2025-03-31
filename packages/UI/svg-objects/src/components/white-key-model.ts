import { BlackKeyPrm } from "./facade"
import { octave_height } from "./facade"
import { PianoRollBegin } from "./facade"
import { mod } from "./facade"
import { RectangleModel } from "./rectangle"

export class WhiteKeyModel extends RectangleModel {
  override get y() {
    return mod(
      this.prm_pos
      + BlackKeyPrm.height * (1 + PianoRollBegin.get())
      , octave_height)
      + this.oct_gap
  }
}