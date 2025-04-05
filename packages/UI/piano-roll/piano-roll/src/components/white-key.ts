import { WhiteKeyModel } from "./white-key-model";
import { Rectangle } from "./rectangle";
import { RectParameters } from "@music-analyzer/view-parameters";
import { KeyPrm } from "@music-analyzer/view-parameters";

class WhiteKeyPrm 
  extends RectParameters {
  static readonly fill = "rgb(255, 255, 255)";
  static readonly stroke = "rgb(0, 0, 0)";
  static readonly width = KeyPrm.width;
  static readonly height = KeyPrm.height / 7;
};

export class WhiteKey extends Rectangle {
  override model: WhiteKeyModel;
  constructor(oct: number, i: number) {
    const pos = [0, 1, 2, 3, 4, 5, 6]
    super("white-key", WhiteKeyPrm, pos, oct, i)
    this.model = new WhiteKeyModel(WhiteKeyPrm, pos, oct, i)
  }
}
