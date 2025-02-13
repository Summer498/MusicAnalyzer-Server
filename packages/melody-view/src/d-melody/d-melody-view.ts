import { hsv2rgb, rgbToString } from "@music-analyzer/color";
import { DMelodyModel } from "./d-melody-model";
import { black_key_prm, CurrentTimeX, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVCView, WindowReflectableRegistry } from "@music-analyzer/view";

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
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
    WindowReflectableRegistry.instance.register(this);
  }
  set onclick(value: () => void) { this.svg.onclick = value; };

  updateX() { this.svg.style.x = String(CurrentTimeX.value + this.model.begin * NoteSize.value); }
  updateY() { this.svg.style.y = String(isNaN(this.model.note) ? -99 : (PianoRollBegin.value - this.model.note) * black_key_prm.height); }
  updateWidth() { this.svg.style.width = String(this.model.duration * NoteSize.value); }
  updateHeight() { this.svg.style.height = String(black_key_prm.height); }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
}
