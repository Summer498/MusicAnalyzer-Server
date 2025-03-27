import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { Rectangle } from "../components";

export abstract class OctaveChunk
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: Rectangle[];
  constructor(
    id: string,
    cnt: number,
    generator: (_: unknown, i: number) => Rectangle
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = id;
    const rects = [...Array(cnt)].map(generator)
    this.children = rects;
    this.children.map(e => this.svg.appendChild(e.svg));
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
