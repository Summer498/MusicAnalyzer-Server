import { WhiteBGsPrm } from "@music-analyzer/view-parameters";
import { WhitePosition } from "@music-analyzer/view-parameters";
import { Rectangle } from "./rectangle";

export class WhiteBG extends Rectangle {
  constructor(oct: number, i: number) {
    super("white-BG", WhiteBGsPrm, WhitePosition.get(), oct, i);
  }
}
