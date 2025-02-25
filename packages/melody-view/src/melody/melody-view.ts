import { BlackKeyPrm,NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { Archetype, get_color_of_implication_realization, get_color_of_Narmour_concept, get_color_on_digital_intervallic_scale, get_color_on_digital_parametric_scale, get_color_on_intervallic_angle, get_color_on_parametric_scale, get_color_on_registral_scale } from "@music-analyzer/irm";
import { MVCView } from "@music-analyzer/view";
import { MelodyModel } from "./melody-model"; 
import { deleteMelody } from "../melody-editor-function";

export class MelodyView extends MVCView {
  readonly svg: SVGRectElement;
  sound_reserved: boolean;
  constructor(
    protected readonly model: MelodyModel,
  ) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "melody-note";
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.onclick = deleteMelody;
    this.sound_reserved = false;
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
    this.updateColor();
    this.svg.style.fill = "rgb(0, 192, 0)";
  }
  colorFunction(getColor: (archetype: Archetype) => string) {
    this.svg.style.fill = getColor(this.model.melody_analysis.implication_realization) || "rgb(0, 0, 0)";
  }
  updateColor() {
    this.colorFunction(get_color_of_Narmour_concept);
    if (false) {
      this.colorFunction(get_color_on_parametric_scale);
      this.colorFunction(get_color_of_implication_realization);
      this.colorFunction(get_color_on_digital_parametric_scale);
      this.colorFunction(get_color_on_digital_intervallic_scale);
      this.colorFunction(get_color_on_intervallic_angle);
      this.colorFunction(get_color_on_registral_scale);
    }
  }
  updateX() { this.svg.setAttribute("x", String(this.model.begin * NoteSize.value)); }
  updateY() { this.svg.setAttribute("y", String(isNaN(this.model.note) ? -99 : (PianoRollBegin.value - this.model.note) * BlackKeyPrm.height)); }
  updateWidth() { this.svg.setAttribute("width", String(31 / 32 * this.model.duration * NoteSize.value)); }
  updateHeight() { this.svg.setAttribute("height", String(BlackKeyPrm.height)); }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
  }
}
