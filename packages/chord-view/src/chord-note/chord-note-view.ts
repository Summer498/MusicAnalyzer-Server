import { mod } from "@music-analyzer/math";
import { ChordNoteModel } from "./chord-note-model";
import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { fifthToColor } from "@music-analyzer/color";
import { MVCView, WindowReflectableRegistry } from "@music-analyzer/view";

export class ChordNoteView extends MVCView {
  protected readonly model: ChordNoteModel;
  readonly svg: SVGRectElement;
  readonly y: number;
  constructor(model: ChordNoteModel) {
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.style.width = String(this.model.duration * NoteSize.value);
    this.svg.style.height = String(BlackKeyPrm.height);
    this.svg.style.stroke = "#444";
    this.svg.style.fill = fifthToColor(this.model.tonic, 0.25, this.model.type === "major" ? 1 : 0.9);
    this.y = (
      mod(PianoRollBegin.value - this.model.note, 12)
      + 12 * this.model.oct
    ) * BlackKeyPrm.height;
    this.updateX();
    this.updateY();
    WindowReflectableRegistry.instance.register(this);
  }
  updateX() { this.svg.setAttribute("x", String(this.model.begin * NoteSize.value)); }
  updateY() { this.svg.setAttribute("y", String(this.y)); }
  updateWidth() { this.svg.style.width = String(this.model.duration * NoteSize.value); }
  updateHeight() { this.svg.style.height = String(BlackKeyPrm.height); }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
}
