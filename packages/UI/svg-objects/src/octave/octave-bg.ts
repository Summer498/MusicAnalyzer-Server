import { WindowReflectable } from "@music-analyzer/view";
import { OctaveBlackBG } from "./octave-black-bg";
import { OctaveWhiteBG } from "./octave-white-bg";

export class OctaveBG 
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly white_BGs: OctaveWhiteBG;
  readonly black_BGs: OctaveBlackBG;
  constructor(
    readonly oct: number,
  ) {
    this.white_BGs = new OctaveWhiteBG(oct);
    this.black_BGs = new OctaveBlackBG(oct);
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-BG-${oct}`;
    this.svg.appendChild(this.white_BGs.svg);
    this.svg.appendChild(this.black_BGs.svg);
  }
  onWindowResized() {
    this.white_BGs.onWindowResized();
    this.black_BGs.onWindowResized();
  }
}
