import { ColorChangeSubscriber } from "./facade";
import { MVVM_View_Impl } from "./facade";
import { SetColor } from "./facade";
import { deleteMelody } from "../../melody-editor-function/delete";
import { MelodyModel } from "./melody-model";

export class MelodyView
  extends MVVM_View_Impl<"rect", MelodyModel>
  implements ColorChangeSubscriber {
  constructor(
    model: MelodyModel,
  ) {
    super("rect", model);
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
