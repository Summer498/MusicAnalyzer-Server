import { RectParameters } from "../../rect-parameter";
import { KeyPrm } from "./key";

export class WhiteKeyPrm 
  extends RectParameters {
  static readonly fill = "rgb(255, 255, 255)";
  static readonly stroke = "rgb(0, 0, 0)";
  static readonly width = KeyPrm.width;
  static readonly height = KeyPrm.height / 7;
};
