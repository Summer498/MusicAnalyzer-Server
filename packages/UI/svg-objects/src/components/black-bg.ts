import { BlackBGsPrm } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants";
import { BlackPosition } from "@music-analyzer/view-parameters/src/position/black-position";
import { Rectangle } from "./rectangle";

export class BlackBG extends Rectangle {
  constructor(oct: number, i: number) {
    super("black-BG", BlackBGsPrm, BlackPosition.get(), oct, i)
  }
}
