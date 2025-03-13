import { fifthToColor } from "@music-analyzer/color";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { MVVM_View } from "@music-analyzer/view";
import { chord_name_margin, chord_text_em, chord_text_size } from "../chord-view-params";
import { shortenChord } from "../shorten";
import { ChordRomanModel } from "./chord-roman-model";

export class ChordRomanView extends MVVM_View<ChordRomanModel, "text"> {
  readonly y: number;
  constructor(model: ChordRomanModel) {
    super(model, "text");
    this.svg.textContent = shortenChord(this.model.roman);
    this.svg.id = "roman-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.fill = fifthToColor(this.model.tonic, 1, 0.75) || "rgb(0, 0, 0)";
    this.y = PianoRollHeight.get() + chord_text_size * 2 + chord_name_margin;
    this.updateX();
    this.updateY();
  }
  updateX() { this.svg.setAttribute("x", String(this.model.time.begin * NoteSize.value)); }
  updateY() { this.svg.setAttribute("y", String(this.y)); }
  onWindowResized() {
    this.updateX();
  }
}
