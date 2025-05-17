import { ChordPart, ChordPartModel, ChordPartSeries, ChordPartView_impl, getColor } from "./chord-parts-series";
import { chord_text_em } from "./chord-view-params/text-em";
import { shortenChord } from "./shorten/chord";

import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { RequiredByChordPartModel } from "./require-by-chord-part-model";
import { chord_text_size } from "./chord-view-params/text-size";
import { PianoRollHeight } from "@music-analyzer/view-parameters";

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
    this.svg.style.fill = getColor(this.model.tonic)(1, 0.75);
  }
}

class ChordName
  extends ChordPart<ChordNameModel, ChordNameView> {
  get svg() { return this.view.svg }
  y: number;
  constructor(
    e: RequiredByChordPartModel,
  ) {
    const model = new ChordNameModel(e);
    const view = new ChordNameView(model);
    super(model, view);
    this.y = PianoRollHeight.get() + chord_text_size
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
