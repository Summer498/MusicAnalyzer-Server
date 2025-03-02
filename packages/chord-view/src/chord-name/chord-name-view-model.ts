import { _Chord } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-view";

export class ChordNameVM extends MVVM_ViewModel<ChordNameModel, ChordNameView> {
  constructor(model: ChordNameModel) {
    super(model, new ChordNameView(model));
  }
}
