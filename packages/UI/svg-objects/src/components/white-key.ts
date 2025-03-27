import { WhiteKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants";
import { Rectangle } from "./rectangle";
import { WhiteKeyModel } from "./white-key-model";

export class WhiteKey extends Rectangle {
  override model: WhiteKeyModel;
  constructor(oct: number, i: number) {
    const pos = [0, 1, 2, 3, 4, 5, 6]
    super("white-key", WhiteKeyPrm, pos, oct, i)
    this.model = new WhiteKeyModel(WhiteKeyPrm, pos, oct, i)
  }
}
