import { chord_name_margin, chord_text_size } from "@music-analyzer/chord-view";
import { WindowReflectable } from "@music-analyzer/view";
import { PianoRollHeight, PianoRollWidth } from "@music-analyzer/view-parameters";
import { AnalysisView, ApplicationManager } from "@music-analyzer/music-analyzer-application"
import { CurrentTimeLine } from "./current-time-line";
import { OctaveBGs } from "./octave/octave-bgs";
import { OctaveKeys } from "./octave/octave-keys";

export class PianoRoll
  implements WindowReflectable {
  readonly svg: SVGSVGElement;
  constructor(
    manager: ApplicationManager
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.id = "piano-roll";
    manager.window_size_mediator.register(this)
    this.appendChildren(
      new OctaveBGs(manager.window_size_mediator).svg,
      new AnalysisView(manager.analyzed).svg,
      new OctaveKeys(manager.window_size_mediator).svg,
      new CurrentTimeLine(!manager.FULL_VIEW, manager.window_size_mediator).svg,
    );
    manager.window_size_mediator.register(this)
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
