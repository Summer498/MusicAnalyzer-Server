import { _Chord } from "@music-analyzer/tonal-objects";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-veiw";
import { MVCController } from "@music-analyzer/view";

export class ChordNameController extends MVCController{
  readonly model: ChordNameModel;
  readonly view: ChordNameView;
  constructor(model: ChordNameModel) {
    super();
    this.model = model;
    this.view = new ChordNameView(this.model);
  }
}
