import { BlackKeyPrm, BlackPosition } from "@music-analyzer/view-parameters";
import { Rectangle } from "./rectangle";

export class BlackKeySVG extends Rectangle {
  constructor(oct: number, i: number) {
    super("black-key", BlackKeyPrm, BlackPosition.get(), oct, i)
  }
}
