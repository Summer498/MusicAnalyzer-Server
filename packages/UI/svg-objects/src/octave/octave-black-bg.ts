import { WindowReflectable } from "@music-analyzer/view";
import { BlackBG } from "../components";

export class OctaveBlackBG
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: BlackBG[];
  constructor(oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-black-bgs-${oct}`;
    const black_key_seed = [...Array(5)];
    this.children = black_key_seed.map((_, black_index) => new BlackBG(oct, black_index));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
