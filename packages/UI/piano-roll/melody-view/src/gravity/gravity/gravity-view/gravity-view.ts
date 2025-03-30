import { MVVM_View_Impl } from "@music-analyzer/view";
import { GravityModel } from "../gravity-model";
import { LinePos } from "../../line-pos";
import { GravityViewTriangle } from "./gravity-triangle";
import { GravityViewLine } from "./gravity-line";

export class GravityView 
  extends MVVM_View_Impl<"g", GravityModel> {
  readonly triangle: GravityViewTriangle;
  readonly line: GravityViewLine;
  constructor(model: GravityModel) {
    super("g", model);

    this.triangle = new GravityViewTriangle(model);
    this.line = new GravityViewLine(model);

    this.svg.id = "gravity";
    this.svg.appendChild(this.triangle.svg);
    this.svg.appendChild(this.line.svg);
  }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
  onWindowResized(line_pos: LinePos) {
    this.triangle.update(line_pos);
    this.line.update(line_pos);
  }
}
