import { ChordPart, ChordPartModel, ChordPartSeries, ChordPartView_impl, getColor } from "./chord-parts-series";
import { chord_name_margin } from "./chord-view-params/margin";
import { chord_text_size } from "./chord-view-params/text-size";
import { chord_text_em } from "./chord-view-params/text-em";
import { oneLetterKey } from "./shorten/on-letter-key";

import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { RequiredByChordPartModel } from "./require-by-chord-part-model";
import { PianoRollHeight } from "@music-analyzer/view-parameters";

interface RequiredByChordKeySeries {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
  readonly audio: AudioReflectableRegistry
}


class ChordKeyModel
  extends ChordPartModel {
  readonly tonic: string;
  constructor(e: RequiredByChordPartModel) {
    super(e);
    this.tonic = this.scale.tonic || "";
  }
}

class ChordKeyView
  extends ChordPartView_impl<"text"> {
  constructor(model: ChordKeyModel) {
    super("text", model);
    this.svg.textContent = oneLetterKey(this.model.scale) + ': ';
    this.svg.id = "key-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.textAnchor = "end";
    this.svg.style.fill = getColor(this.model.tonic)(1, 0.75);
  }
}

class ChordKey
  extends ChordPart<ChordKeyModel, ChordKeyView> {
  get svg() {return this.view.svg}
  y: number;
  constructor(
    e: RequiredByChordPartModel,
  ) {
    const model = new ChordKeyModel(e);
    const view = new ChordKeyView(model);
    super(model, view);
    this.y = PianoRollHeight.get() + chord_text_size + (chord_text_size + chord_name_margin);
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
    romans: RequiredByChordPartModel[],
    controllers: RequiredByChordKeySeries
  ) {
    super("key-names", controllers, romans.map(e => new ChordKey(e)));
  }
}
