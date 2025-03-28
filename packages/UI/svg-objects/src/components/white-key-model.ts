import { BlackKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants"
import { octave_height } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants"
import { PianoRollBegin } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-begin"
import { RectangleModel } from "./rectangle/rectangle"
import { mod } from "@music-analyzer/math/src/basic-function/mod"

export class WhiteKeyModel extends RectangleModel {
  override get y() {
    return mod(
      this.prm_pos
      + BlackKeyPrm.height * (1 + PianoRollBegin.get())
      , octave_height)
      + this.oct_gap
  }
}