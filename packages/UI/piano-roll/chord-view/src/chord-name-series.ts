import { ChordPartModel, ChordPartSeries, ChordPartView_impl } from "./chord-parts-series";
import { ChordPartText } from "./chord-part-text";
import { chord_text_em } from "./chord-view-params/text-em";
import { shortenChord } from "./shorten/chord";

import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { RequiredByChordPartModel } from "./require-by-chord-part-model";

interface RequiredByChordNameSeries {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}


class ChordNameModel
  extends ChordPartModel {
  readonly tonic: string;
  readonly name: string;
  constructor(e: RequiredByChordPartModel) {
    super(e);
    this.tonic = this.chord.tonic || "";
    this.name = this.chord.name;
  }
}

class ChordNameView
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

class ChordName
  extends ChordPartText<ChordNameModel, ChordNameView> {
  y: number;
  constructor(
    e: RequiredByChordPartModel,
  ) {
    const model = new ChordNameModel(e);
    super(model, new ChordNameView(model));
    this.y = this.getBottom();
    this.updateX();
    this.updateY();
  }
  onWindowResized() {
    this.updateX();
  }
}

export class ChordNameSeries
  extends ChordPartSeries<ChordName> {
  constructor(
    romans: RequiredByChordPartModel[],
    controllers: RequiredByChordNameSeries,
  ) {
    super("chord-names", controllers, romans.map(e => new ChordName(e)));
  }
}
