import { LinePos } from "../../gravity/gravity-view";

export class ArrowLine {
  constructor(
    readonly svg: SVGLineElement
  ) { }
  update(line_pos: LinePos) {
    this.svg.setAttribute("x1", String(line_pos.x1));
    this.svg.setAttribute("x2", String(line_pos.x2));
    this.svg.setAttribute("y1", String(line_pos.y1));
    this.svg.setAttribute("y2", String(line_pos.y2));
  }
}

const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
line.id = "gravity-arrow";
line.classList.add("line");
line.style.stroke = "rgb(0, 0, 0)";
line.style.strokeWidth = String(5);

const arrow_line = new ArrowLine(line)