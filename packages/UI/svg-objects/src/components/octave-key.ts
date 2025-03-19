import { WindowReflectable } from "@music-analyzer/view";
import { OctaveWhiteKey } from "../components.ts/white-key";
import { OctaveBlackKey } from "../octave/black-key";

export class OctaveKey 
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly white_keys: OctaveWhiteKey;
  readonly black_keys: OctaveBlackKey;
  constructor(
    readonly oct: number,
  ) {
    this.white_keys = new OctaveWhiteKey(oct);
    this.black_keys = new OctaveBlackKey(oct);
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-key-${oct}`;
    this.svg.appendChild(this.white_keys.svg);
    this.svg.appendChild(this.black_keys.svg);
  }
  onWindowResized() {
    this.white_keys.onWindowResized();
    this.black_keys.onWindowResized();
  }
}
