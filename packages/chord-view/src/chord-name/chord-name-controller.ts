import { _Chord } from "@music-analyzer/tonal-objects";
import { MVCController } from "@music-analyzer/view";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-view";

export class ChordNameController extends MVCController{
  readonly view: ChordNameView;
  constructor(
    readonly model: ChordNameModel
  ) {
    super();
    this.view = new ChordNameView(this.model);
  }
}
