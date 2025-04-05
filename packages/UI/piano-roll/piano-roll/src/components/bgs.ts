import { RectParameters } from "@music-analyzer/view-parameters";
import { octave_height } from "@music-analyzer/view-parameters";
import { PianoRollWidth } from "@music-analyzer/view-parameters";

export class BGsPrm 
  extends RectParameters {
  static readonly stroke = "rgb(0, 0, 0)";
  static readonly width = PianoRollWidth.get();
  static readonly height = octave_height / 12;
}
