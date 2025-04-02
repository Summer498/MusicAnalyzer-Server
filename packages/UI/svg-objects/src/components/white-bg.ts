import { BGsPrm } from "./bgs";
import { Rectangle } from "./rectangle";

import { mod } from "@music-analyzer/math";
import { PianoRollBegin } from "@music-analyzer/view-parameters";

const white_seed = [0, 1, 3, 5, 7, 8, 10];

const transposed = (e: number) => e - PianoRollBegin.get()

class WhitePosition {
  static get() {
    return white_seed.map(e => mod(-transposed(-e), 12));
  }
}

class WhiteBGsPrm 
  extends BGsPrm {
  static readonly fill = "rgb(242, 242, 242)";
}

export class WhiteBG extends Rectangle {
  constructor(oct: number, i: number) {
    super("white-BG", WhiteBGsPrm, WhitePosition.get(), oct, i);
  }
}
