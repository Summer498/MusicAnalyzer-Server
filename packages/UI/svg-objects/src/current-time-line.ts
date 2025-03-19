import { WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { CurrentTimeX, PianoRollHeight } from "@music-analyzer/view-parameters";

export class CurrentTimeLine 
implements WindowReflectable {
  readonly svg: SVGLineElement;
  constructor(
    visible: boolean,
    publisher: WindowReflectableRegistry
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.id = "current_time";
    this.svg.style.strokeWidth = String(5);
    this.svg.style.stroke = "rgb(0, 0, 0)";
    this.svg.style.visibility = visible ? "visible" : "hidden";
    publisher.register(this)
  }
  onWindowResized() {
    this.svg.setAttribute("x1", `${CurrentTimeX.get()}`);
    this.svg.setAttribute("x2", `${CurrentTimeX.get()}`);
    this.svg.setAttribute("y1", "0");
    this.svg.setAttribute("y2", `${PianoRollHeight.get()}`);
  }
}
