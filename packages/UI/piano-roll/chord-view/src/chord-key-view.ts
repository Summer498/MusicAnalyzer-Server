import { oneLetterKey } from "./shorten/on-letter-key";
import { chord_text_em } from "./chord-view-params/text-em";
import { ChordPartView } from "./chord-part-view";
import { ChordKeyModel } from "./chord-key-model";

export class ChordKeyView
  extends ChordPartView<"text"> {
  constructor(model: ChordKeyModel,) {
    super("text", model);
    this.svg.textContent = oneLetterKey(this.model.scale) + ': ';
    this.svg.id = "key-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.textAnchor = "end";
    this.svg.style.fill = this.getColor(1, 0.75);
  }
}

