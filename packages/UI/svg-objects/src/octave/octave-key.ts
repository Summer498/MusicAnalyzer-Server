import { WindowReflectableRegistry } from "@music-analyzer/view";
import { OctaveBlackKey } from "./octave-black-key";
import { OctaveWhiteKey } from "./octave-white-key";

export class OctaveKey {
  readonly svg: SVGGElement;
  readonly white_keys: OctaveWhiteKey;
  readonly black_keys: OctaveBlackKey;
  constructor(
    readonly oct: number,
    publisher: WindowReflectableRegistry
  ) {
    this.white_keys = new OctaveWhiteKey(oct, publisher);
    this.black_keys = new OctaveBlackKey(oct, publisher);
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-key-${oct}`;
    this.svg.appendChild(this.white_keys.svg);
    this.svg.appendChild(this.black_keys.svg);
  }
}
