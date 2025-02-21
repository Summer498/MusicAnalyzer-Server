import { _Chord } from "@music-analyzer/tonal-objects";
import { MVCController } from "@music-analyzer/view";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-view";

export class ChordNameController extends MVCController{
  readonly model: ChordNameModel;
  readonly view: ChordNameView;
  constructor(model: ChordNameModel) {
    super();
    this.model = model;
    this.view = new ChordNameView(this.model);
  }
}
