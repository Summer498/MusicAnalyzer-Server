import { chord_name_margin } from "./facade/margin";
import { chord_text_size } from "./facade/chord-view-params";
import { ChordKeyModel } from "./facade/model";
import { ChordKeyView } from "./facade/chord-view";
import { RequiredByChordKeyModel } from "./facade/r-model";
import { IChordKey } from "./facade/i-part";
import { ChordPartText } from "./chord-part-text";

export class ChordKey
  extends ChordPartText<ChordKeyModel, ChordKeyView>
  implements IChordKey {
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
