import { WindowReflectable } from "@music-analyzer/view";
import { WhiteKey } from "../components";

export class OctaveWhiteKey
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: WhiteKey[];
  constructor(oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-white-keys-${oct}`;
    const seed = [...Array(7)];
    this.children = seed.map((_, i) => new WhiteKey(oct, i));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
