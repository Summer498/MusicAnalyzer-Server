import { deleteMelody } from "../melody-editor/delete";
import { ColorChangeable } from "../color-changeable";

export class MelodyView
  extends ColorChangeable<"rect"> {
  constructor(
  ) {
    super("rect");
    this.svg.id = "melody-note";
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.onclick = deleteMelody;
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
  readonly setColor = (color:string) => this.svg.style.fill = "#0d0";
}
