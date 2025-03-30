import { shortenChord } from "./facade";
import { chord_text_em } from "./facade";
import { ChordPartView_impl } from "./chord-part-view-impl";
import { ChordNameModel } from "./facade";

export class ChordNameView
  extends ChordPartView_impl<"text"> {
  constructor(model: ChordNameModel) {
    super("text", model);
    this.svg.textContent = shortenChord(this.model.chord.name);
    this.svg.id = "chord-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.fill = this.getColor(1, 0.75);
  }
}
