import { WhiteBGsPrm } from "./facade";
import { WhitePosition } from "./facade";
import { Rectangle } from "./rectangle";

export class WhiteBG extends Rectangle {
  constructor(oct: number, i: number) {
    super("white-BG", WhiteBGsPrm, WhitePosition.get(), oct, i);
  }
}
