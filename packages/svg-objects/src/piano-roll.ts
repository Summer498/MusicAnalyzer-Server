import { chord_name_margin, chord_text_size } from "@music-analyzer/chord-view";
import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { PianoRollHeight, PianoRollWidth } from "@music-analyzer/view-parameters";

export class PianoRoll implements WindowReflectable {
  readonly svg: SVGSVGElement;
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.id = "piano-roll";
    WindowReflectableRegistry.instance.register(this);
  }
  onWindowResized() {
    this.svg.style.x = String(0);
    this.svg.style.y = String(0);
    this.svg.style.width = String(PianoRollWidth.value);
    this.svg.style.height = String(PianoRollHeight.value + chord_text_size * 2 + chord_name_margin);
  }
}
