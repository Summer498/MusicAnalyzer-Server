import { ColorChangeSubscriber } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/color-change-subscriber";
import { MVVM_View } from "@music-analyzer/view/src/mvvm/view";
import { deleteMelody } from "../../melody-editor-function/delete";
import { MelodyModel } from "./melody-model";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";

export class MelodyView
  extends MVVM_View<"rect", MelodyModel>
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
