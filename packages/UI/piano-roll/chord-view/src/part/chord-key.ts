import { chord_name_margin } from "./facade";
import { chord_text_size } from "./facade";
import { ChordKeyModel } from "./facade";
import { ChordKeyView } from "./facade";
import { RequiredByChordKeyModel } from "./facade";
import { IChordKey } from "./facade";
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
