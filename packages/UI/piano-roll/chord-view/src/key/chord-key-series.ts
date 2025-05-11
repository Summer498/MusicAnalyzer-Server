import { RequiredByChordKeyModel, RequiredByChordKeySeries } from "./r-chord-key-series";
import { ChordPartModel, ChordPartSeries, ChordPartView_impl } from "../chord-parts-series";
import { chord_name_margin } from "../chord-view-params/margin";
import { chord_text_size } from "../chord-view-params/text-size";
import { ChordPartText } from "../chord-part-text";
import { chord_text_em } from "../chord-view-params/text-em";
import { oneLetterKey } from "../shorten/on-letter-key";

export class ChordKeyModel 
  extends ChordPartModel {
  readonly tonic: string;
  constructor(e: RequiredByChordKeyModel) {
    super(e);
    this.tonic = this.scale.tonic || "";
  }
}

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

export class ChordKey
  extends ChordPartText<ChordKeyModel, ChordKeyView> {
  y: number;
  constructor(
    e: RequiredByChordKeyModel,
  ) {
    const model = new ChordKeyModel(e);
    super(model, new ChordKeyView(model));
    this.y = this.getBottom() + (chord_text_size + chord_name_margin);
    this.updateX();
    this.updateY();
  }
  onWindowResized() {
    this.updateX();
  }
}

export class ChordKeySeries
  extends ChordPartSeries<ChordKey> {
  readonly remaining: ChordKey | undefined;
  constructor(
    romans: RequiredByChordKeyModel[],
    controllers: RequiredByChordKeySeries
  ) {
    super("key-names", controllers, romans.map(e => new ChordKey(e)));
  }
}
