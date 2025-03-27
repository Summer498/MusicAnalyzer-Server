import { MVVM_View } from "@music-analyzer/view/src/mvc";
import { LinePos } from "../../line-pos";
import { GravityModel } from "../gravity-model";

export class GravityViewLine 
  extends MVVM_View<"line", GravityModel> {
  constructor(model: GravityModel) {
    super("line", model);
    this.svg.id = "gravity-arrow";
    this.svg.classList.add("line");
    this.svg.style.stroke = "rgb(0, 0, 0)";
    this.svg.style.strokeWidth = String(5);
  }
  update(line_pos: LinePos) {
    this.svg.setAttribute("x1", String(line_pos.x1));
    this.svg.setAttribute("x2", String(line_pos.x2));
    this.svg.setAttribute("y1", String(line_pos.y1));
    this.svg.setAttribute("y2", String(line_pos.y2));
  }
  onWindowResized() { }
}
