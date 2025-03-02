import { _Chord } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordRomanModel } from "./chord-roman-model";
import { ChordRomanView } from "./chord-roman-view";

export class ChordRomanVM extends MVVM_ViewModel<ChordRomanModel, ChordRomanView> {
  constructor(model: ChordRomanModel) {
    super(model, new ChordRomanView(model));
  }
}
