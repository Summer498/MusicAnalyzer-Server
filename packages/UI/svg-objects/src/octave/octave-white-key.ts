import { WindowReflectableRegistry } from "@music-analyzer/view";
import { WhiteKeySVG } from "../components";

export class OctaveWhiteKey {
  readonly svg: SVGGElement;
  readonly children: WhiteKeySVG[];
  constructor(
    oct: number,
    publisher: WindowReflectableRegistry
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-white-keys-${oct}`;
    const white_seed = [...Array(7)];
    this.children = white_seed.map((_, white_index) => new WhiteKeySVG(oct, white_index, publisher));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
}
