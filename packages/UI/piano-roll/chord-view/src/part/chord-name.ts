import { IChordName } from "../i-part";
import { ChordNameModel } from "../model";
import { RequiredByChordNameModel } from "../r-model";
import { ChordNameView } from "../view";
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
