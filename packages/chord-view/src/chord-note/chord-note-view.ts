import { mod } from "@music-analyzer/math";
import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { fifthToColor } from "@music-analyzer/color";
import { MVCView } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";

export class ChordNoteView extends MVCView {
  readonly svg: SVGRectElement;
  readonly y: number;
  constructor(
    protected readonly model: ChordNoteModel,
  ) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.setAttribute("width", String(this.model.duration * NoteSize.value));
    this.svg.setAttribute("height", String(BlackKeyPrm.height));
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.style.fill = fifthToColor(this.model.tonic, 0.25, this.model.type === "major" ? 1 : 0.9);
    this.y = (
      mod(PianoRollBegin.value - this.model.note, 12)
      + 12 * this.model.oct
    ) * BlackKeyPrm.height;
    this.updateX();
    this.updateY();
  }
  updateX() { this.svg.setAttribute("x", String(this.model.begin * NoteSize.value)); }
  updateY() { this.svg.setAttribute("y", String(this.y)); }
  updateWidth() { this.svg.setAttribute("width", String(this.model.duration * NoteSize.value)); }
  updateHeight() { this.svg.setAttribute("height", String(BlackKeyPrm.height)); }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
}
