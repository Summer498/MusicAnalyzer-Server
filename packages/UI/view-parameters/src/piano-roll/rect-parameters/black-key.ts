import { RectParameters } from "../../rect-parameter";
import { KeyPrm } from "./key";

export class BlackKeyPrm 
  extends RectParameters {
  static readonly fill = "rgb(64, 64, 64)";
  static readonly stroke = "rgb(0, 0, 0)";
  static readonly width = KeyPrm.width * 2 / 3;
  static readonly height = KeyPrm.height / 12;
}
