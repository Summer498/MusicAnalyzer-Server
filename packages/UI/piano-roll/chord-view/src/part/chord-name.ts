import { ChordNameModel } from "./facade/model";
import { RequiredByChordNameModel } from "./facade/r-model";
import { IChordName } from "./facade/i-part";
import { ChordNameView } from "./facade/chord-view";
import { ChordPartText } from "./chord-part-text";

export class ChordName
  extends ChordPartText<ChordNameModel, ChordNameView>
  implements IChordName {
  y: number;
  constructor(
    e: RequiredByChordNameModel,
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
