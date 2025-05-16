import { Hierarchy, Layer, Model, Part } from "./abstract-hierarchy";
import { PianoRollConverter, size } from "@music-analyzer/view-parameters";
import { ColorChangeable } from "./color-changeable";
import { Triad } from "@music-analyzer/irm";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { SetColor } from "@music-analyzer/controllers";

export class IRSymbolModel
  extends Model {
  readonly note: number;
  readonly archetype: Triad;
  readonly layer: number;
  constructor(e: SerializedTimeAndAnalyzedMelody, layer: number) {
    super(
      e.time,
      e.head,
    );
    this.note = e.note;
    this.archetype = e.melody_analysis.implication_realization as Triad;
    this.layer = layer || 0;
  }
}

const ir_analysis_em = size;
export class IRSymbolView
  extends ColorChangeable<"text"> {
  constructor(
    protected readonly model: IRSymbolModel,
  ) {
    super("text");
    this.svg.textContent = this.model.archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${ir_analysis_em}em`;
    this.svg.style.textAnchor = "middle";
    this.svg.style.visibility = "hidden";
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}

export class IRSymbol
  extends Part<IRSymbolModel, IRSymbolView> {
  #y: number;
  constructor(
    model: IRSymbolModel,
    view: IRSymbolView,
  ) {
    super(model, view);
    this.#y = PianoRollConverter.midi2NNBlackCoordinate(this.model.note)
    this.updateX();
    this.updateY();
  }
  updateX() {
    this.view.updateX(
      PianoRollConverter.scaled(this.model.time.begin)
      + PianoRollConverter.scaled(this.model.time.duration) / 2
    )
  }
  updateY() { this.view.updateY(this.#y) }
  onWindowResized() {
    this.updateX();
  }
  onTimeRangeChanged = this.onWindowResized
  readonly setColor: SetColor = f => this.view.setColor(f(this.model.archetype))
}

export class IRSymbolLayer
  extends Layer<IRSymbol> {
  constructor(
    children: IRSymbol[],
    layer: number,
  ) {
    super(layer, children);
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}

export class IRSymbolHierarchy
  extends Hierarchy<IRSymbolLayer> {
  constructor(
    children: IRSymbolLayer[],
  ) {
    super("implication-realization archetype", children);
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
}

export function buildIRSymbol(
    h_melodies: SerializedTimeAndAnalyzedMelody[][],
  ) {
  const children = h_melodies.map((e, l) => {
    const parts = e.map(e => {
      const model = new IRSymbolModel(e, l);
      const view = new IRSymbolView(model);
      return new IRSymbol(model, view)
    });
    return new IRSymbolLayer(parts, l)
  });
  return new IRSymbolHierarchy(children);
}
