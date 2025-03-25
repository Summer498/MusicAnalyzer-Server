import { WindowReflectable } from "@music-analyzer/view";
import { OctaveBlackBG } from "../octave-chunk/octave-black-bg";
import { OctaveWhiteBG } from "../octave-chunk/octave-white-bg";

export class OctaveBG
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly white: OctaveWhiteBG;
  readonly black: OctaveBlackBG;
  constructor(readonly oct: number) {
    this.white = new OctaveWhiteBG(oct);
    this.black = new OctaveBlackBG(oct);
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-BG-${oct}`;
    this.svg.appendChild(this.white.svg);
    this.svg.appendChild(this.black.svg);
  }
  onWindowResized() {
    this.white.onWindowResized();
    this.black.onWindowResized();
  }
}
