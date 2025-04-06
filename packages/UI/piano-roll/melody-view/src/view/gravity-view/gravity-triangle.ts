import { MVVM_View_Impl } from "@music-analyzer/view";
import { LinePos } from "../line-pos";

const triangle_width = 4;
const triangle_height = 5;

export class GravityViewTriangle 
  extends MVVM_View_Impl<"polygon"> {
  constructor() {
    super("polygon");
    this.svg.classList.add("triangle");
    this.svg.id = "gravity-arrow";
    this.svg.style.stroke = "rgb(0, 0, 0)";
    this.svg.style.fill = "rgb(0, 0, 0)";
    this.svg.style.strokeWidth = String(5);

    this.svg.setAttribute("points", this.getInitPos().join(","));
  }
  getInitPos() { return [0, 0, - triangle_width, + triangle_height, + triangle_width, + triangle_height,]; }
  update(line_pos: LinePos) {
    const angle = line_pos.getAngle() + 90;
    this.svg.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
  }
  onWindowResized() { }
}
