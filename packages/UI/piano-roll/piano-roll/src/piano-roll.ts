import { chord_name_margin } from "./facade";
import { chord_text_size } from "./facade";
import { WindowReflectable } from "./facade";
import { WindowReflectableRegistry } from "./facade";
import { PianoRollHeight } from "./facade";
import { PianoRollWidth } from "./facade";
import { CurrentTimeLine } from "./facade";
import { OctaveBGs } from "./facade";
import { OctaveKeys } from "./facade";
import { AnalysisView } from "./analysis-view";
import { MusicStructureElements } from "./music-structure-elements";

export class PianoRoll
  implements WindowReflectable {
  readonly svg: SVGSVGElement;
  constructor(
    analyzed: MusicStructureElements,
    window: WindowReflectableRegistry,
    show_current_time_line: boolean
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.id = "piano-roll";
    window.register(this)
    this.appendChildren(
      new OctaveBGs(window).svg,
      new AnalysisView(analyzed).svg,
      new OctaveKeys(window).svg,
      new CurrentTimeLine(show_current_time_line, window).svg,
    );
    window.register(this)
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
