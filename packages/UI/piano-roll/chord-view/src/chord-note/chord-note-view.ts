import { mod } from "@music-analyzer/math";
import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { fifthToColor, thirdToColor } from "@music-analyzer/color";
import { MVVM_View } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class ChordNoteView extends MVVM_View<ChordNoteModel, "rect"> {
  readonly y: number;
  constructor(model: ChordNoteModel) {
    super(model, "rect");
    this.svg.setAttribute("width", String(scaled(this.model.time.duration)));
    this.svg.setAttribute("height", String(BlackKeyPrm.height));
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.style.fill = thirdToColor(
      this.model.note_name,
      this.model.tonic,
      0.25,
      1
    );
    if (false) {
      this.svg.style.fill = fifthToColor(this.model.tonic, 0.25, this.model.type === "major" ? 1 : 0.9);
    }
    this.y =
      convertToCoordinate(mod(-transposed(this.model.note), 12))
      + convertToCoordinate(12 * this.model.oct);
    this.updateX();
    this.updateY();
  }
  updateX() { this.svg.setAttribute("x", String(scaled(this.model.time.begin))); }
  updateY() { this.svg.setAttribute("y", String(this.y)); }
  updateWidth() { this.svg.setAttribute("width", String(scaled(this.model.time.duration))); }
  updateHeight() { this.svg.setAttribute("height", String(BlackKeyPrm.height)); }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
}
