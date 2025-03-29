import { fifthToColor } from "@music-analyzer/color/src/fifth-to-color";
import { MVVM_View } from "@music-analyzer/view/src/mvvm/view";
import { oneLetterKey } from "./shorten/on-letter-key";
import { chord_text_em } from "./chord-view-params/text-em";
import { ChordPartModel } from "./chord-part-model";

export class ChordPartView<Tag extends keyof SVGElementTagNameMap>
  extends MVVM_View<Tag, ChordPartModel> {
  constructor(tag: Tag, model: ChordPartModel,) {
    super(tag, model);
    this.svg.textContent = oneLetterKey(this.model.scale) + ': ';
    this.svg.id = "key-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.textAnchor = "end";
    this.svg.style.fill = this.getColor(1, 0.75);
  }
  protected getColor(s: number, v: number) { return fifthToColor(this.model.tonic, s, v) || "rgb(0, 0, 0)" }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}

