import { fifthToColor } from "./facade/color";
import { MVVM_View_Impl } from "./facade/view";
import { oneLetterKey } from "./facade/shorten";
import { chord_text_em } from "./facade/chord-view-params";
import { ChordPartModel } from "./facade/model";

export class ChordPartView_impl<Tag extends keyof SVGElementTagNameMap>
  extends MVVM_View_Impl<Tag, ChordPartModel> {
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

