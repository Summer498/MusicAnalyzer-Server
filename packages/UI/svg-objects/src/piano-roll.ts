import { chord_name_margin, chord_text_size } from "@music-analyzer/chord-view";
import { WindowReflectable } from "@music-analyzer/view";
import { PianoRollHeight, PianoRollWidth } from "@music-analyzer/view-parameters";
import { ApplicationManager } from "@music-analyzer/music-analyzer-application"
import { OctaveBGs } from "./octave-bg";
import { AnalysisView } from "@music-analyzer/music-analyzer-application";
import { OctaveKeys } from "./octave-keys";
import { CurrentTimeLine } from "./current-time-line";

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
      new AnalysisView(manager.analyzed, [manager.window_size_mediator, manager.audio_time_mediator]).svg,
      new OctaveKeys(manager.window_size_mediator).svg,
      new CurrentTimeLine(!manager.FULL_VIEW, manager.window_size_mediator).svg,
    );

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
