import { _Chord } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordRomanModel } from "./chord-roman-model";
import { ChordRomanView } from "./chord-roman-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";

export class ChordRomanVM extends MVVM_ViewModel<ChordRomanModel, ChordRomanView> {
  constructor(e: TimeAndRomanAnalysis) {
    const model = new ChordRomanModel(e);
    super(model, new ChordRomanView(model));
  }
}
