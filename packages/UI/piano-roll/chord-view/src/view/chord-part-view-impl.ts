import { MVVM_View_Impl } from "@music-analyzer/view";
import { fifthToColor } from "@music-analyzer/color";
import { ChordPartModel } from "../model";
import { oneLetterKey } from "../shorten";
import { chord_text_em } from "../chord-view-params";

export class ChordPartView_impl<Tag extends keyof SVGElementTagNameMap>
  extends MVVM_View_Impl<Tag> {
  constructor(
    tag: Tag,
    protected readonly model: ChordPartModel
  ) {
    super(tag);
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

