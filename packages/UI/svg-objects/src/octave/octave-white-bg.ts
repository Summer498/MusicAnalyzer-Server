import { WindowReflectable } from "@music-analyzer/view";
import { WhiteBG_SVG } from "../components/white-bg";

export class OctaveWhiteBG
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: WhiteBG_SVG[];
  constructor(oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-white-bgs-${oct}`;
    const white_key_seed = [...Array(7)];
    this.children = white_key_seed.map((_, white_index) => new WhiteBG_SVG(oct, white_index));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
