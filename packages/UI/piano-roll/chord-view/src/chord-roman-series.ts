import { ChordPartModel, ChordPartSeries, ChordPartView_impl } from "./chord-parts-series";
import { chord_name_margin } from "./chord-view-params/margin";
import { chord_text_size } from "./chord-view-params/text-size";
import { ChordPartText } from "./chord-part-text";
import { shortenChord } from "./shorten/chord";
import { chord_text_em } from "./chord-view-params/text-em";

import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { RequiredByChordPartModel } from "./require-by-chord-part-model";

interface RequiredByChordRomanSeries {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

class ChordRomanModel
  extends ChordPartModel {
  readonly tonic: string;
  constructor(e: RequiredByChordPartModel) {
    super(e);
    this.tonic = e.chord.tonic || "";
  }
}

class ChordRomanView
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

class ChordRoman
  extends ChordPartText<ChordRomanModel, ChordRomanView> {
  y: number;
  constructor(
    e: RequiredByChordPartModel,
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
    romans: RequiredByChordPartModel[],
    controllers: RequiredByChordRomanSeries,
  ) {
    super("roman-names", controllers, romans.map(e => new ChordRoman(e)));
  }
}
