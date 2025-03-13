import { MVVM_View } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";
import { LinePos } from "./line-pos";

const triangle_width = 4;
const triangle_height = 5;

export class GravityViewTriangle extends MVVM_View<GravityModel, "polygon"> {
  constructor(model: GravityModel) {
    super(model, "polygon");
    this.svg.classList.add("triangle");
    this.svg.id = "gravity-arrow";
    this.svg.style.stroke = "rgb(0, 0, 0)";
    this.svg.style.strokeWidth = String(5);
    this.svg.style.fill = "rgb(0, 0, 0)";

    this.svg.setAttribute("points", this.getInitPos().join(","));
  }
  getInitPos() { return [0, 0, - triangle_width, + triangle_height, + triangle_width, + triangle_height,]; }
  getAngle(line_pos: LinePos) {
    const w = line_pos.x2 - line_pos.x1;
    const h = line_pos.y2 - line_pos.y1;
    return Math.atan2(h, w) * 180 / Math.PI + 90;
  }
  update(line_pos: LinePos) {
    const angle = this.getAngle(line_pos);
    this.svg.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
  }
  onWindowResized() { }
}
