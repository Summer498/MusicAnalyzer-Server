import { mod } from "@music-analyzer/math";
import { ChordNoteModel } from "./chord-note-model";
import { black_key_prm, CurrentTimeX, NoteSize, NowAtX, PianoRollBegin, PianoRollEnd } from "@music-analyzer/view-parameters";
import { fifthToColor } from "@music-analyzer/color";
import { MVCView } from "@music-analyzer/view";

export class ChordNoteView extends MVCView {
  protected readonly model: ChordNoteModel;
  readonly svg: SVGRectElement;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  constructor(model: ChordNoteModel) {
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.y = (
      mod(PianoRollBegin.value - this.model.note, 12) 
      + 12 * this.model.oct
    ) * black_key_prm.height;
    this.w = this.model.end - this.model.begin;
    this.h = black_key_prm.height;
  }
  onAudioUpdate() {
    this.svg.style.x = String(CurrentTimeX.value + this.model.begin * NoteSize.value - NowAtX.value);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(this.w * NoteSize.value);
    this.svg.style.height = String(this.h);
    this.svg.style.stroke = "#444";
    this.svg.style.fill = fifthToColor(this.model.tonic, 0.25, this.model.type === "major" ? 1 : 0.9);
  }
}

