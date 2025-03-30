import { BlackKeyPrm } from "@music-analyzer/view-parameters"
import { octave_height } from "@music-analyzer/view-parameters"
import { PianoRollBegin } from "@music-analyzer/view-parameters"
import { RectangleModel } from "./rectangle"
import { mod } from "@music-analyzer/math"

export class WhiteKeyModel extends RectangleModel {
  override get y() {
    return mod(
      this.prm_pos
      + BlackKeyPrm.height * (1 + PianoRollBegin.get())
      , octave_height)
      + this.oct_gap
  }
}