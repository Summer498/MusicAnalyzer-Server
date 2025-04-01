import { chord_text_em } from "../chord-view-params";
import { ChordKeyModel } from "../model";
import { oneLetterKey } from "../shorten";
import { ChordPartView_impl } from "./chord-part-view-impl";

export class ChordKeyView
  extends ChordPartView_impl<"text"> {
  constructor(model: ChordKeyModel) {
    super("text", model);
    this.svg.textContent = oneLetterKey(this.model.scale) + ': ';
    this.svg.id = "key-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.textAnchor = "end";
    this.svg.style.fill = this.getColor(1, 0.75);
  }
}

