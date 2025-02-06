import { hsv2rgb, rgbToString } from "@music-analyzer/color";
import { DMelodyModel } from "./d-melody-model";
import { black_key_prm, CurrentTimeX, NoteSize, NowAtX, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVCView } from "@music-analyzer/view";

export class DMelodyView extends MVCView {
  readonly svg: SVGRectElement;
  protected readonly model: DMelodyModel;
  constructor(model: DMelodyModel) {
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "melody-note";
    this.svg.style.fill = rgbToString(hsv2rgb(0, 0, 0.75));
    this.svg.style.stroke = "#444";
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  set onclick(value: () => void) { this.svg.onclick = value; };

  updateX() { this.svg.style.x = String(CurrentTimeX.value + this.model.begin * NoteSize.value - NowAtX.value); }
  updateY() { this.svg.style.y = String(this.model.note === undefined ? -99 : (PianoRollBegin.value - this.model.note) * black_key_prm.height); }
  updateWidth() { this.svg.style.width = String(this.model.end * NoteSize.value - this.model.begin * NoteSize.value); }
  updateHeight() { this.svg.style.height = String(black_key_prm.height); }
}
