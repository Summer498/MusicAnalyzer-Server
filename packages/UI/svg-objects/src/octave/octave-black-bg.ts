import { WindowReflectable } from "@music-analyzer/view";
import { BlackBG } from "../components";

export class OctaveBlackBG
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: BlackBG[];
  constructor(oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-black-bgs-${oct}`;
    const seed = [...Array(5)];
    this.children = seed.map((_, i) => new BlackBG(oct, i));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
