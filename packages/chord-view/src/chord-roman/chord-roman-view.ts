import { fifthToColor } from "@music-analyzer/color";
import { chord_name_margin, chord_text_em, chord_text_size } from "../chord-view-params";
import { shorten_chord } from "../shorten";
import { ChordRomanModel } from "./chord-roman-model";
import { CurrentTimeX, NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { MVCView, WindowReflectableRegistry } from "@music-analyzer/view";

export class ChordRomanView extends MVCView {
  protected readonly model: ChordRomanModel;
  readonly svg: SVGTextElement;
  readonly y: number;
  constructor(model: ChordRomanModel){
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = shorten_chord(this.model.roman);
    this.svg.id = "roman-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.fill = fifthToColor(this.model.tonic, 1, 0.75) || "#000";
    this.y = PianoRollHeight.value + chord_text_size * 2 + chord_name_margin;
    this.updateX();
    this.updateY();
    WindowReflectableRegistry.instance.register(this);
  }
  updateX() { this.svg.setAttribute("x", String(CurrentTimeX.value + this.model.begin * NoteSize.value)); }
  updateY() { this.svg.setAttribute("y", String(this.y)); }
  onWindowResized() {
    this.updateX();
  }
}
