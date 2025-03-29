import { shortenChord } from "./shorten/chord";
import { chord_text_em } from "./chord-view-params/text-em";
import { ChordPartView } from "./chord-part-view";
import { ChordRomanModel } from "./chord-roman-model";

export class ChordRomanView
  extends ChordPartView<"text"> {
  constructor(model: ChordRomanModel) {
    super("text", model);
    this.svg.textContent = shortenChord(this.model.roman);
    this.svg.id = "roman-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.fill = this.getColor(1, 0.75);
  }
}
