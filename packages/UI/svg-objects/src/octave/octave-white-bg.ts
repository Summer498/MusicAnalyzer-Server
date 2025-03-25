import { WindowReflectable } from "@music-analyzer/view";
import { WhiteBG } from "../components";

export class OctaveWhiteBG
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: WhiteBG[];
  constructor(oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-white-bgs-${oct}`;
    const seed = [...Array(7)];
    this.children = seed.map((_, i) => new WhiteBG(oct, i));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
