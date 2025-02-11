import { _Chord } from "@music-analyzer/tonal-objects";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-veiw";

export class ChordNameController {
  readonly model: ChordNameModel;
  readonly view: ChordNameView;
  constructor(model: ChordNameModel) {
    this.model = model;
    this.view = new ChordNameView(this.model);
  }
}
