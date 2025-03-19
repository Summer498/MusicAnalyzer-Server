import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class IRSymbolVM 
extends MVVM_ViewModel<IRSymbolModel, IRSymbolView> {
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
  setColor(getColor: (e: IRSymbolModel) => string) {
    this.view.setColor(getColor);
  }
  updateColor() { this.view.updateColor(); }
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
}
