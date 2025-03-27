import { BlackKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants";
import { BlackPosition } from "@music-analyzer/view-parameters/src/position/black-position";
import { Rectangle } from "./rectangle";

export class BlackKey extends Rectangle {
  constructor(oct: number, i: number) {
    super("black-key", BlackKeyPrm, BlackPosition.get(), oct, i)
  }
}
