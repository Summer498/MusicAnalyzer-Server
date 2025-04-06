import { ColorChangeSubscriber } from "@music-analyzer/controllers";
import { MVVM_View_Impl } from "@music-analyzer/view";
import { SetColor } from "@music-analyzer/controllers";
import { deleteMelody } from "./delete";

export class MelodyView
  extends MVVM_View_Impl<"rect">
  implements ColorChangeSubscriber {
  constructor(
  ) {
    super("rect");
    this.svg.id = "melody-note";
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.onclick = deleteMelody;
  }
  readonly setColor: SetColor = getColor => this.svg.style.fill = "rgb(0, 192, 0)";
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}
