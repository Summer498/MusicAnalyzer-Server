import { WindowReflectable } from "@music-analyzer/view";
import { OctaveChunk } from "../octave-chunk";

export abstract class Octave
  implements WindowReflectable {
  readonly svg: SVGGElement;
  constructor(
    readonly id: string,
    readonly white: OctaveChunk,
    readonly black: OctaveChunk,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = id;
    this.svg.appendChild(this.white.svg);
    this.svg.appendChild(this.black.svg);
  }
  onWindowResized() {
    this.white.onWindowResized();
    this.black.onWindowResized();
  }
}
