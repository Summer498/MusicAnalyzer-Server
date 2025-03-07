import { _Scale } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordKeyModel } from "./chord-key-model";
import { ChordKeyView } from "./chord-key-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";

export class ChordKeyVM extends MVVM_ViewModel<ChordKeyModel, ChordKeyView> {
  constructor(e: TimeAndRomanAnalysis) {
    const model = new ChordKeyModel(e);
    super(model, new ChordKeyView(model));
  }
}
