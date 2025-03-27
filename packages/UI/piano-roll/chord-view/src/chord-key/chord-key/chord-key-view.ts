import { fifthToColor } from "@music-analyzer/color";
import { MVVM_View } from "@music-analyzer/view/src/mvc";
import { oneLetterKey } from "../../shorten";
import { chord_text_em } from "../../chord-view-params";
import { ChordKeyModel } from "./chord-key-model";
import { getScale } from "@music-analyzer/tonal-objects/src/scale/get";

export class ChordKeyView 
  extends MVVM_View<"text", ChordKeyModel> {
  constructor(model: ChordKeyModel,) {
    super("text", model);
    this.svg.textContent = oneLetterKey(getScale(this.model.scale)) + ': ';
    this.svg.id = "key-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.textAnchor = "end";
    this.svg.style.fill = fifthToColor(this.model.tonic, 1, 0.75) || "rgb(0, 0, 0)";
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}

