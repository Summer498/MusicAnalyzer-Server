import { _Chord } from "@music-analyzer/tonal-objects";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { fifthToColor } from "@music-analyzer/color";
import { MVVM_View } from "@music-analyzer/view";
import { shortenChord } from "../shorten";
import { ChordNameModel } from "./chord-name-model";
import { chord_text_em, chord_text_size } from "../chord-view-params";

export class ChordNameView extends MVVM_View<ChordNameModel, "text"> {
  readonly y: number;
  constructor(model: ChordNameModel) {
    super(model, "text");
    this.svg.textContent = shortenChord(this.model.name);
    this.svg.id = "chord-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.fill = fifthToColor(this.model.tonic, 1, 0.75) || "rgb(0, 0, 0)";
    this.y = PianoRollHeight.get() + chord_text_size;
    this.updateX();
    this.updateY();
  }
  updateX() { this.svg.setAttribute("x", String(this.model.time.begin * NoteSize.get())); }
  updateY() { this.svg.setAttribute("y", String(this.y)); }
  onWindowResized() {
    this.updateX();
  }
}
