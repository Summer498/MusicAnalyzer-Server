import { BlackKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { PianoRollBegin } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-begin";
import { MVVM_ViewModel} from "@music-analyzer/view/src/mvc";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";
import { RequiredByIRSymbolView } from "./ir-symbol-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { TimeRangeController } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export interface RequiredByIRSymbol
  extends RequiredByIRSymbolView {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}

export class IRSymbol
  extends MVVM_ViewModel<IRSymbolModel, IRSymbolView>
  implements TimeRangeSubscriber {
  #y: number;
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer: number,
  ) {
    const model = new IRSymbolModel(melody, layer);
    super(model, new IRSymbolView(model));
    this.#y = isNaN(this.model.note) ? -99 : -convertToCoordinate(transposed(this.model.note));
    this.updateX();
    this.updateY();
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
  readonly setColor: SetColor = f => this.view.setColor(f)
}
