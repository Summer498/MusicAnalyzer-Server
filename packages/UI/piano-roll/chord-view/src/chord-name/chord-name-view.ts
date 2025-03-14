import { fifthToColor } from "@music-analyzer/color";
import { MVVM_View } from "@music-analyzer/view";
import { shortenChord } from "../shorten";
import { ChordNameModel } from "./chord-name-model";
import { chord_text_em } from "../chord-view-params";

export class ChordNameView extends MVVM_View<ChordNameModel, "text"> {
  constructor(model: ChordNameModel) {
    super(model, "text");
    this.svg.textContent = shortenChord(this.model.name);
    this.svg.id = "chord-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.fill = fifthToColor(this.model.tonic, 1, 0.75) || "rgb(0, 0, 0)";
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}
