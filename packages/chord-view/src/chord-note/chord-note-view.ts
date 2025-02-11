import { mod } from "@music-analyzer/math";
import { ChordNoteModel } from "./chord-note-model";
import { black_key_prm, NoteSize, PianoRollTranslateX, PianoRollBegin, PianoRollEnd } from "@music-analyzer/view-parameters";
import { fifthToColor } from "@music-analyzer/color";
import { MVCView } from "@music-analyzer/view";

export class ChordNoteView extends MVCView {
  protected readonly model: ChordNoteModel;
  readonly svg: SVGRectElement;
  readonly y: number;
  constructor(model: ChordNoteModel) {
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.style.width = String(this.model.duration * NoteSize.value);
    this.svg.style.height = String(black_key_prm.height);
    this.svg.style.stroke = "#444";
    this.svg.style.fill = fifthToColor(this.model.tonic, 0.25, this.model.type === "major" ? 1 : 0.9);
    this.y = (
      mod(PianoRollBegin.value - this.model.note, 12)
      + 12 * this.model.oct
    ) * black_key_prm.height;
    this.onUpdateX();
    this.onUpdateY();
  }
  onUpdateX() { this.svg.setAttribute("x", String(this.model.begin * NoteSize.value)); }
  onUpdateY() { this.svg.setAttribute("y", String(this.y)); }
  onAudioUpdate() {
    // this.onUpdateX();
  }
}

