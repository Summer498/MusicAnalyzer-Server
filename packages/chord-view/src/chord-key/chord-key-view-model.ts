import { _Scale } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordKeyModel } from "./chord-key-model";
import { ChordKeyView } from "./chord-key-view";

export class ChordKeyVM extends MVVM_ViewModel<ChordKeyModel, ChordKeyView> {
  constructor(model: ChordKeyModel) {
    super(model, new ChordKeyView(model));
  }
}
