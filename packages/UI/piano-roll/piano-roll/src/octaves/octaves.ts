import { WindowReflectableRegistry } from "@music-analyzer/view";
import { OctaveCount } from "@music-analyzer/view-parameters";
import { Octave } from "../octave";

export class Octaves {
  readonly svg: SVGGElement;
  readonly children: Octave[];
  constructor(
    id: string,
    window_registry: WindowReflectableRegistry,
    generator: (_: unknown, i: number) => Octave
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = id;
    this.children = [...Array(OctaveCount.get())].map(generator)
    this.children.forEach(e => this.svg.appendChild(e.svg));
    window_registry.addListeners(this.onWindowResized);
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
