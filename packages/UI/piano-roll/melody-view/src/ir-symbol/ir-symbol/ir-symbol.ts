import { BlackKeyPrm } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVVM_ViewModel_Impl } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class IRSymbol
  extends MVVM_ViewModel_Impl<IRSymbolModel, IRSymbolView>
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
