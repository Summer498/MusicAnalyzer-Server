import { RectParameters } from "./rect-parameter";
import { octave_height } from "./octave-height";

export class KeyPrm 
  extends RectParameters {
  static readonly stroke = "rgb(0, 0, 0)";
  static readonly width = 36;
  static readonly height = octave_height;
};
