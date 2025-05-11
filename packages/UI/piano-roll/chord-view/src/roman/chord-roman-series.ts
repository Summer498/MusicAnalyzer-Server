import { ChordPartModel, ChordPartSeries, ChordPartView_impl } from "../chord-parts-series";
import { RequiredByChordRomanModel, RequiredByChordRomanSeries } from "./r-chord-roman-series";
import { chord_name_margin } from "../chord-view-params/margin";
import { chord_text_size } from "../chord-view-params/text-size";
import { ChordPartText } from "../chord-part-text";
import { shortenChord } from "../shorten/chord";
import { chord_text_em } from "../chord-view-params/text-em";

export class ChordRomanModel
  extends ChordPartModel {
  readonly tonic: string;
  constructor(e: RequiredByChordRomanModel) {
    super(e);
    this.tonic = e.chord.tonic || "";
  }
}

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

export class ChordRoman
  extends ChordPartText<ChordRomanModel, ChordRomanView> {
  y: number;
  constructor(
    e: RequiredByChordRomanModel,
  ) {
    const model = new ChordRomanModel(e);
    super(model, new ChordRomanView(model));
    this.y = this.getBottom() + (chord_text_size + chord_name_margin);
    this.updateX();
    this.updateY();
  }
  onWindowResized() {
    this.updateX();
  }
}

export class ChordRomanSeries
  extends ChordPartSeries<ChordRoman> {
  constructor(
    romans: RequiredByChordRomanModel[],
    controllers: RequiredByChordRomanSeries,
  ) {
    super("roman-names", controllers, romans.map(e => new ChordRoman(e)));
  }
}
