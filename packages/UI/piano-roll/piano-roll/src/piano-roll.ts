import { WindowReflectableRegistry } from "@music-analyzer/view";
import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { PianoRollWidth } from "@music-analyzer/view-parameters";
import { chord_name_margin } from "@music-analyzer/chord-view";
import { chord_text_size } from "@music-analyzer/chord-view";
import { AnalysisView } from "./analysis-view";
import { MusicStructureElements } from "./music-structure-elements";
import { CurrentTimeLine } from "./current-time-line";
import { OctaveBGs } from "./octaves";
import { OctaveKeys } from "./octaves";

export class PianoRoll {
  readonly svg: SVGSVGElement;
  constructor(
    analyzed: MusicStructureElements,
    window: WindowReflectableRegistry,
    show_current_time_line: boolean
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.id = "piano-roll";
    window.addListeners(this.onWindowResized)
    this.appendChildren(
      new OctaveBGs(window).svg,
      new AnalysisView(analyzed).svg,
      new OctaveKeys(window).svg,
      new CurrentTimeLine(show_current_time_line, window).svg,
    );
    window.addListeners(this.onWindowResized)
  }
  appendChildren(...children: SVGElement[]) {
    children.forEach(e => this.svg.appendChild(e));
    return this;
  }
  onWindowResized() {
    this.svg.setAttribute("x", String(0));
    this.svg.setAttribute("y", String(0));
    this.svg.setAttribute("width", String(PianoRollWidth.get()));
    this.svg.setAttribute("height", String(PianoRollHeight.get() + chord_text_size * 2 + chord_name_margin));
  }
}
