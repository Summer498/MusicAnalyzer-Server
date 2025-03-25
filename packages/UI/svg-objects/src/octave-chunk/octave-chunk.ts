import { WindowReflectable } from "@music-analyzer/view";
import { Rectangle } from "../components";

export abstract class OctaveChunk
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: Rectangle[];
  constructor(
    id: string,
    rects: Rectangle[]
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = id;
    this.children = rects;
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
