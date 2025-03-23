import { ColorChangeSubscriber, MelodyColorController } from "@music-analyzer/controllers";
import { Triad } from "@music-analyzer/irm";
import { MVVM_View } from "@music-analyzer/view";
import { deleteMelody } from "../../melody-editor-function";
import { MelodyModel } from "./melody-model";

export interface RequiredByMelodyView {
  readonly melody_color: MelodyColorController
}
export class MelodyView
  extends MVVM_View<"rect", MelodyModel>
  implements
  ColorChangeSubscriber {
  constructor(
    model: MelodyModel,
    controllers: RequiredByMelodyView
  ) {
    super("rect", model);
    this.svg.id = "melody-note";
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.onclick = deleteMelody;
    controllers.melody_color.register(this);
  }
  setColor(getColor: (e: Triad) => string) { this.svg.style.fill = "rgb(0, 192, 0)"; }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}
