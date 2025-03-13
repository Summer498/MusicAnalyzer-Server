import { hsv2rgb, rgbToString } from "@music-analyzer/color";
import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVVM_View } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";

export class DMelodyView extends MVVM_View<DMelodyModel, "rect"> {
  constructor(model: DMelodyModel) {
    super(model, "rect");
    this.svg.id = "melody-note";
    this.svg.style.fill = rgbToString(hsv2rgb(0, 0, 0.75));
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  set onclick(value: () => void) { this.svg.onclick = value; };

  updateX() { this.svg.setAttribute("x", String(this.model.time.begin * NoteSize.value)); }
  updateY() { this.svg.setAttribute("y", String(isNaN(this.model.note) ? -99 : (PianoRollBegin.value - this.model.note) * BlackKeyPrm.height)); }
  updateWidth() { this.svg.setAttribute("width", String(this.model.time.duration * NoteSize.value)); }
  updateHeight() { this.svg.setAttribute("height", String(BlackKeyPrm.height)); }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
}
