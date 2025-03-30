import { RectParameters } from "../rect-parameter";
import { octave_height } from "../height/octave-height";
import { PianoRollWidth } from "../width/piano-roll-width";

export class BGsPrm 
  extends RectParameters {
  static readonly stroke = "rgb(0, 0, 0)";
  static readonly width = PianoRollWidth.get();
  static readonly height = octave_height / 12;
}
