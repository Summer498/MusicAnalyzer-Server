import { chord_name_margin, chord_text_size } from "@music-analyzer/chord-view";
import { WindowReflectable } from "@music-analyzer/view";
import { PianoRollHeight, PianoRollWidth } from "@music-analyzer/view-parameters";

export class PianoRoll implements WindowReflectable {
  readonly svg: SVGSVGElement;
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.id = "piano-roll";
  }
  onWindowResized() {
    this.svg.setAttribute("x", String(0));
    this.svg.setAttribute("y", String(0));
    this.svg.setAttribute("width", String(PianoRollWidth.get()));
    this.svg.setAttribute("height", String(PianoRollHeight.value + chord_text_size * 2 + chord_name_margin));
  }
}
