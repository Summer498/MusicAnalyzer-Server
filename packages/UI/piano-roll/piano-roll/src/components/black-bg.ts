import { BGsPrm } from "./bgs";
import { BlackPosition } from "../parameters"
import { Rectangle } from "./rectangle";

class BlackBGsPrm 
  extends BGsPrm {
  static readonly fill = "rgb(192, 192, 192)";
}

export class BlackBG extends Rectangle {
  constructor(oct: number, i: number) {
    super("black-BG", BlackBGsPrm, BlackPosition.get(), oct, i)
  }
}
