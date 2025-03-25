import { BlackBGsPrm, BlackPosition } from "@music-analyzer/view-parameters";
import { Rectangle } from "./rectangle";

export class BlackBG extends Rectangle {
  constructor(oct: number, i: number) {
    super("black-BG", BlackBGsPrm, BlackPosition.get(), oct, i)
  }
}
