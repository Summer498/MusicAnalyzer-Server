import { ChordNameModel } from "./facade";
import { RequiredByChordNameModel } from "./facade";
import { IChordName } from "./facade";
import { ChordNameView } from "./facade";
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
