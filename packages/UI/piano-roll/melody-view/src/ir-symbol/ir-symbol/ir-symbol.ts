import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MelodyColorController } from "@music-analyzer/controllers";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class IRSymbol
  extends MVVM_ViewModel<IRSymbolModel, IRSymbolView> {
  #y: number;
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer: number,
    controllers: [MelodyColorController, WindowReflectableRegistry]
  ) {
    const model = new IRSymbolModel(melody, layer);
    super(model, new IRSymbolView(model, [controllers[0]]));
    this.#y = isNaN(this.model.note) ? -99 : -convertToCoordinate(transposed(this.model.note));
    this.updateX();
    this.updateY();
    controllers[1].register(this);
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
}
