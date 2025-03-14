import { get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { MVVM_View } from "@music-analyzer/view";
import { MelodyModel } from "./melody-model";
import { deleteMelody } from "../melody-editor-function";

export class MelodyView extends MVVM_View<MelodyModel, "rect"> {
  sound_reserved: boolean;
  #getColor: (e: MelodyModel) => string;
  constructor(model: MelodyModel) {
    super(model, "rect");
    this.svg.id = "melody-note";
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.onclick = deleteMelody;
    this.sound_reserved = false;
    this.svg.style.fill = "rgb(0, 192, 0)";
    this.#getColor = e => get_color_of_Narmour_concept(e.archetype);
  }
  setColor(getColor: (e: MelodyModel) => string) {
    this.#getColor = getColor;
    this.svg.style.fill = this.#getColor(this.model) || "rgb(0, 0, 0)";
    this.svg.style.fill = "rgb(0, 192, 0)";
  }
  updateColor() {
    this.#getColor(this.model) || "rgb(0, 0, 0)";
  }
  updateX(x:number) { this.svg.setAttribute("x", String(x)); }
  updateY(y:number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w:number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h:number) { this.svg.setAttribute("height", String(h)); }
}
