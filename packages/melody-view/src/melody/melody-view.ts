import { black_key_prm, NoteSize, PianoRollTranslateX, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MelodyModel } from "./melody-model";
import { deleteMelody } from "../melody-editor-function";
import { get_color_of_Narmour_concept, get_color_on_parametric_scale } from "@music-analyzer/irm";
import { fifthChromaToColor } from "@music-analyzer/color";
import { MVCView } from "@music-analyzer/view";

export class MelodyView extends MVCView {
  readonly svg: SVGRectElement;
  protected readonly model: MelodyModel;
  sound_reserved: boolean;
  constructor(model: MelodyModel) {
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "melody-note";
    this.svg.style.fill = "#0c0";
    if (0) {
      this.svg.style.fill = get_color_on_parametric_scale(this.model.melody_analysis.implication_realization);
      this.svg.style.fill = get_color_of_Narmour_concept(this.model.melody_analysis.implication_realization);
      this.svg.style.fill = this.model.note ? fifthChromaToColor(this.model.note, 0.75, 0.9) : "#000";
    }
    this.svg.style.stroke = "#444";
    this.sound_reserved = false;
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateX() { this.svg.style.x = String(this.model.begin * NoteSize.value); }
  updateY() { this.svg.style.y = String(isNaN(this.model.note) ? -99 : (PianoRollBegin.value - this.model.note) * black_key_prm.height); }
  updateWidth() { this.svg.style.width = String(this.model.duration * 15 / 16 * NoteSize.value); }
  updateHeight() { this.svg.style.height = String(black_key_prm.height); }
  set onclick(value: () => void) { this.svg.onclick = value; }
  onAudioUpdate() {
    this.onclick = deleteMelody;
    // this.updateX();
  }
}
