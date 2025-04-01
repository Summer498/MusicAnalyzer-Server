import { chord_text_em } from "../chord-view-params";
import { ChordRomanModel } from "../model";
import { shortenChord } from "../shorten";
import { ChordPartView_impl } from "./chord-part-view-impl";

export class ChordRomanView
  extends ChordPartView_impl<"text"> {
  constructor(model: ChordRomanModel) {
    super("text", model);
    this.svg.textContent = shortenChord(this.model.roman);
    this.svg.id = "roman-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.fill = this.getColor(1, 0.75);
  }
}
