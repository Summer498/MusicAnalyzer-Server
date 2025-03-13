import { _Chord } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";

export class ChordNameVM extends MVVM_ViewModel<ChordNameModel, ChordNameView> {
  constructor(e: TimeAndRomanAnalysis) {
    const model = new ChordNameModel(e);
    super(model, new ChordNameView(model));
  }
}
