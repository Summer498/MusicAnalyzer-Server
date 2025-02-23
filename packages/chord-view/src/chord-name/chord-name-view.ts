import { _Chord } from "@music-analyzer/tonal-objects";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { fifthToColor } from "@music-analyzer/color";
import { MVCView } from "@music-analyzer/view";
import { shorten_chord } from "../shorten"; 
import { ChordNameModel } from "./chord-name-model";
import { chord_text_em, chord_text_size } from "../chord-view-params";

export class ChordNameView extends MVCView {
  protected readonly model: ChordNameModel;
  readonly svg: SVGTextElement;
  readonly y: number;
  constructor(model: ChordNameModel) {
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = shorten_chord(this.model.name);
    this.svg.id = "chord-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.fill = fifthToColor(this.model.tonic, 1, 0.75) || "rgb(0, 0, 0)";
    this.y = PianoRollHeight.value + chord_text_size;
    this.updateX();
    this.updateY();
  }
  updateX() { this.svg.setAttribute("x", String(this.model.begin * NoteSize.value)); }
  updateY() { this.svg.setAttribute("y", String(this.y)); }
  onWindowResized() {
    this.updateX();
  }
}
