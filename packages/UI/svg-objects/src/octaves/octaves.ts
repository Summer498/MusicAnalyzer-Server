import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { Octave } from "../octave";
import { OctaveCount } from "@music-analyzer/view-parameters";

export class Octaves
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: Octave[];
  constructor(
    id: string,
    publisher: WindowReflectableRegistry,
    generator: (_: unknown, i: number) => Octave
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = id;
    this.children = [...Array(OctaveCount.get())].map(generator)
    this.children.forEach(e => this.svg.appendChild(e.svg));
    publisher.register(this);
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
