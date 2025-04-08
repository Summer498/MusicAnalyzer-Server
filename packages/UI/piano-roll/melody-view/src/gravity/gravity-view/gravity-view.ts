import { LinePos } from "./line-pos";
import { GravityViewTriangle } from "./gravity-triangle";
import { GravityViewLine } from "./gravity-line";
import { View } from "../../abstract/abstract-view";

export class GravityView 
  extends View<"g"> {
  readonly triangle: GravityViewTriangle;
  readonly line: GravityViewLine;
  constructor() {
    super("g");

    this.triangle = new GravityViewTriangle();
    this.line = new GravityViewLine();

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
