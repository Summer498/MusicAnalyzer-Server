import { WhiteBGsPrm } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants";
import { WhitePosition } from "@music-analyzer/view-parameters/src/position/white-position";
import { Rectangle } from "./rectangle/rectangle";

export class WhiteBG extends Rectangle {
  constructor(oct: number, i: number) {
    super("white-BG", WhiteBGsPrm, WhitePosition.get(), oct, i);
  }
}
