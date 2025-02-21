import { _Scale } from "@music-analyzer/tonal-objects";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { fifthToColor } from "@music-analyzer/color";
import { MVCView } from "@music-analyzer/view";
import { shorten_key } from "../shorten";  
import { ChordKeyModel } from "./chord-key-model"; 
import { chord_name_margin, chord_text_em, chord_text_size } from "../chord-view-params";

export class ChordKeyView extends MVCView {
  protected readonly model: ChordKeyModel;
  readonly svg: SVGTextElement;
  readonly y: number;
  constructor(model: ChordKeyModel) {
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = shorten_key(_Scale.get(this.model.scale)) + ': ';
    this.svg.id = "key-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.textAnchor = "end";
    this.svg.style.fill = fifthToColor(this.model.tonic, 1, 0.75) || "#000";
    this.y = PianoRollHeight.value + chord_text_size * 2 + chord_name_margin;
    this.updateX();
    this.updateY();
  }
  updateX() { this.svg.setAttribute("x", String(this.model.begin * NoteSize.value)); }
  updateY() { this.svg.setAttribute("y", String(this.y)); }
  onWindowResized() {
    this.updateX();
  }
}

