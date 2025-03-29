import { shortenChord } from "./shorten/chord";
import { chord_text_em } from "./chord-view-params/text-em";
import { ChordPartView } from "./chord-part-view";
import { ChordNameModel } from "./chord-name-model";

export class ChordNameView
  extends ChordPartView<"text"> {
  constructor(model: ChordNameModel) {
    super("text", model);
    this.svg.textContent = shortenChord(this.model.chord.name);
    this.svg.id = "chord-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.fill = this.getColor(1, 0.75);
  }
}
