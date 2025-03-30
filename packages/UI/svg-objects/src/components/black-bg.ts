import { BlackBGsPrm } from "@music-analyzer/view-parameters";
import { BlackPosition } from "@music-analyzer/view-parameters";
import { Rectangle } from "./rectangle/rectangle";

export class BlackBG extends Rectangle {
  constructor(oct: number, i: number) {
    super("black-BG", BlackBGsPrm, BlackPosition.get(), oct, i)
  }
}
