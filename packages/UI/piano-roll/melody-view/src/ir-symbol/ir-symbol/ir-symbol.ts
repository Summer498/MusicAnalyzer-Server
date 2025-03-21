import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView, RequiredByIRSymbolView } from "./ir-symbol-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export interface RequiredByIRSymbol
  extends RequiredByIRSymbolView {
  readonly window: WindowReflectableRegistry
}

export class IRSymbol
  extends MVVM_ViewModel<IRSymbolModel, IRSymbolView>
  implements TimeRangeSubscriber {
  #y: number;
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer: number,
    controllers: RequiredByIRSymbol,
  ) {
    const model = new IRSymbolModel(melody, layer);
    super(model, new IRSymbolView(model, controllers));
    this.#y = isNaN(this.model.note) ? -99 : -convertToCoordinate(transposed(this.model.note));
    this.updateX();
    this.updateY();
    controllers.window.register(this);
  }
  updateX() {
    this.view.updateX(
      scaled(this.model.time.begin)
      + scaled(this.model.time.duration) / 2
    )
  }
  updateY() { this.view.updateY(this.#y) }
  onWindowResized() {
    this.updateX();
  }
  onTimeRangeChanged = this.onWindowResized
}
