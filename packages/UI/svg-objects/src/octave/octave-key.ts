import { WindowReflectable } from "@music-analyzer/view";
import { OctaveBlackKey } from "./octave-chunk.ts/octave-black-key";
import { OctaveWhiteKey } from "./octave-chunk.ts/octave-white-key";

export class OctaveKey
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly white: OctaveWhiteKey;
  readonly black: OctaveBlackKey;
  constructor(readonly oct: number) {
    this.white = new OctaveWhiteKey(oct);
    this.black = new OctaveBlackKey(oct);
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-key-${oct}`;
    this.svg.appendChild(this.white.svg);
    this.svg.appendChild(this.black.svg);
  }
  onWindowResized() {
    this.white.onWindowResized();
    this.black.onWindowResized();
  }
}
