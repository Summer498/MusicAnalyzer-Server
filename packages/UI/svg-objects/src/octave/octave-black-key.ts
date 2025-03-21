import { WindowReflectableRegistry } from "@music-analyzer/view";
import { BlackKeySVG } from "../components";

export class OctaveBlackKey {
  readonly svg: SVGGElement;
  readonly children: BlackKeySVG[];
  constructor(
    oct: number,
    publisher: WindowReflectableRegistry
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-black-keys-${oct}`;
    const black_key_seed = [...Array(5)];
    this.children = black_key_seed.map((_, j) => new BlackKeySVG(oct, j, publisher));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
}
