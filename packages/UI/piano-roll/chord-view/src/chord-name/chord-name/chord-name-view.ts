import { fifthToColor } from "@music-analyzer/color/src/fifth-to-color";;
import { shortenChord } from "../../shorten/chord";
import { ChordNameModel } from "./chord-name-model";
import { chord_text_em } from "../../chord-view-params/text-em";
import { MVVM_View } from "@music-analyzer/view/src/mvvm/view";

export class ChordNameView 
  extends MVVM_View<"text", ChordNameModel> {
  constructor(model: ChordNameModel) {
    super("text", model);
    this.svg.textContent = shortenChord(this.model.name);
    this.svg.id = "chord-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.fill = fifthToColor(this.model.tonic, 1, 0.75) || "rgb(0, 0, 0)";
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}
