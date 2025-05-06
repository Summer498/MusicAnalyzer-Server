import { LinePos } from "../../gravity/gravity-view";

const triangle_width = 4;
const triangle_height = 5;

export class ArrowTriangle {
  constructor(
    readonly svg: SVGPolygonElement
  ) { }
  update(line_pos: LinePos) {
    const angle = line_pos.getAngle() + 90;
    this.svg.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
  }
  onWindowResized() { }
}

const getInitPos = () => { return [0, 0, - triangle_width, + triangle_height, + triangle_width, + triangle_height,]; }

const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
triangle.classList.add("triangle");
triangle.id = "gravity-arrow";
triangle.style.stroke = "rgb(0, 0, 0)";
triangle.style.fill = "rgb(0, 0, 0)";
triangle.style.strokeWidth = String(5);

triangle.setAttribute("points", getInitPos().join(","));
const arrow_triangle = new ArrowTriangle(triangle);