import { OctaveCount } from "@music-analyzer/view-parameters";
import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { OctaveBG } from "../octave";

export class OctaveBGs
  implements WindowReflectable {
  readonly svg: SVGGElement;
  readonly children: OctaveBG[];
  constructor(publisher: WindowReflectableRegistry) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "octave-BGs";
    const octave_seed = [...Array(OctaveCount.get())];
    this.children = octave_seed.map((_, oct) => new OctaveBG(oct));
    this.children.forEach(e => this.svg.appendChild(e.svg));
    publisher.register(this);
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
