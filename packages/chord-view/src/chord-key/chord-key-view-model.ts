import { _Scale } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordKeyModel } from "./chord-key-model";
import { ChordKeyView } from "./chord-key-view";

export class ChordKeyVM extends MVVM_ViewModel {
  readonly view: ChordKeyView;
  constructor(
    readonly model: ChordKeyModel
  ) {
    super();
    this.view = new ChordKeyView(this.model);
  }
}
