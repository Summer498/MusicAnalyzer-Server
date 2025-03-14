import { chord_name_margin, chord_text_size } from "@music-analyzer/chord-view";
import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { PianoRollHeight, PianoRollWidth } from "@music-analyzer/view-parameters";

export class PianoRoll implements WindowReflectable {
  readonly svg: SVGSVGElement;
  constructor(
    publisher: WindowReflectableRegistry,
    children: SVGElement[]
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.id = "piano-roll";
    children.forEach(e=>this.svg.appendChild(e));
    publisher.register(this)
  }
  onWindowResized() {
    this.svg.setAttribute("x", String(0));
    this.svg.setAttribute("y", String(0));
    this.svg.setAttribute("width", String(PianoRollWidth.get()));
    this.svg.setAttribute("height", String(PianoRollHeight.get() + chord_text_size * 2 + chord_name_margin));
  }
}
