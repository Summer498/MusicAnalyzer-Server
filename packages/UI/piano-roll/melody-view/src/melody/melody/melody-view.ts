import { ColorChangeSubscriber, MelodyColorController } from "@music-analyzer/controllers";
import { get_color_of_Narmour_concept, Triad } from "@music-analyzer/irm";
import { MVVM_View } from "@music-analyzer/view";
import { deleteMelody } from "../../melody-editor-function";
import { MelodyModel } from "./melody-model";

export interface RequiredByMelodyView {
  melody_color: MelodyColorController
}
export class MelodyView
  extends MVVM_View<MelodyModel, "rect">
  implements
  ColorChangeSubscriber {
  #getColor: (e: Triad) => string;
  constructor(
    model: MelodyModel,
    controllers: RequiredByMelodyView
  ) {
    super(model, "rect");
    this.svg.id = "melody-note";
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.onclick = deleteMelody;
    this.svg.style.fill = "rgb(0, 192, 0)";
    this.#getColor = get_color_of_Narmour_concept;
    controllers.melody_color.register(this);
  }
  setColor(getColor: (e: Triad) => string) {
    this.#getColor = getColor;
    this.svg.style.fill = this.#getColor(this.model.archetype) || "rgb(0, 0, 0)";
    this.svg.style.fill = "rgb(0, 192, 0)";
  }
  updateColor() {
    this.#getColor(this.model.archetype) || "rgb(0, 0, 0)";
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}
