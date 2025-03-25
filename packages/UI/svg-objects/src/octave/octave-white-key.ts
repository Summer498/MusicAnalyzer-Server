import { WindowReflectable } from "@music-analyzer/view";
import { WhiteKey } from "../components";

export class OctaveWhiteKey
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: WhiteKey[];
  constructor(oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `octave-white-keys-${oct}`;
    const white_seed = [...Array(7)];
    this.children = white_seed.map((_, white_index) => new WhiteKey(oct, white_index));
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
