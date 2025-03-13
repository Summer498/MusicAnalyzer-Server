import { WindowReflectable } from "@music-analyzer/view";
import { CurrentTimeX, PianoRollHeight } from "@music-analyzer/view-parameters";

export class CurrentTimeLine implements WindowReflectable {
  readonly svg: SVGLineElement;
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.id = "current_time";
    this.svg.style.strokeWidth= String(5);
    this.svg.style.stroke = "rgb(0, 0, 0)";
  }
  onWindowResized() {
    this.svg.setAttribute("x1", `${CurrentTimeX.value}`);
    this.svg.setAttribute("x2", `${CurrentTimeX.value}`);
    this.svg.setAttribute("y1", "0");
    this.svg.setAttribute("y2", `${PianoRollHeight.get()}`);
  }
}
