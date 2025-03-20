import { OctaveCount } from "@music-analyzer/view-parameters";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { OctaveKey } from "./octave-key";

export class OctaveKeys {
  readonly svg: SVGGElement;
  readonly children: OctaveKey[];
  constructor(
    publisher: WindowReflectableRegistry
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-keys";
    const octave_seed = [...Array(OctaveCount.get())];
    this.children = octave_seed.map((_, oct) => new OctaveKey(oct, publisher));
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
}
