import { SetColor } from "@music-analyzer/controllers";
import { Part } from "../abstract/abstract-part";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";

export class IRSymbol
  extends Part<IRSymbolModel, IRSymbolView> {
  #y: number;
  constructor(
    model: IRSymbolModel,
    view: IRSymbolView,
  ) {
    super(model, view);
    this.#y = isNaN(this.model.note) ? -99 : -this.converter.convertToCoordinate(this.converter.transposed(this.model.note));
    this.updateX();
    this.updateY();
  }
  updateX() {
    this.view.updateX(
      this.converter.scaled(this.model.time.begin)
      + this.converter.scaled(this.model.time.duration) / 2
    )
  }
  updateY() { this.view.updateY(this.#y) }
  onWindowResized() {
    this.updateX();
  }
  onTimeRangeChanged = this.onWindowResized
  readonly setColor: SetColor = f => this.view.setColor(f(this.model.archetype))
}
