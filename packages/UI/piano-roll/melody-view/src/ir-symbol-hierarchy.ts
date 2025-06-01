import { PianoRollConverter, size } from "@music-analyzer/view-parameters";
import { Triad } from "@music-analyzer/irm";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { HierarchyLevelController, MelodyColorController, SetColor, TimeRangeController } from "@music-analyzer/controllers";
import { Time } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";

class IRSymbolModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly archetype: Triad;
  readonly layer: number;
  constructor(e: SerializedTimeAndAnalyzedMelody, layer: number) {
    this.time = e.time;
    this.head = e.head;
    this.note = e.note;
    this.archetype = e.melody_analysis.implication_realization as Triad;
    this.layer = layer || 0;
  }
}

const ir_analysis_em = size;
class IRSymbolView {
  constructor(
    readonly svg: SVGTextElement,
  ) { }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  readonly setColor = (color: string) => this.svg.style.fill = color;
}

class IRSymbol {
  get svg() { return this.view.svg; }
  #y: number;
  constructor(
    readonly model: IRSymbolModel,
    readonly view: IRSymbolView,
  ) {
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

class IRSymbolLayer {
  readonly children_model: { readonly time: Time }[];
  #show: IRSymbol[];
  get show() { return this.#show; };
  constructor(
    readonly svg: SVGGElement,
    readonly children: IRSymbol[],
    readonly layer: number,
  ) {
    this.svg = svg;
    this.children_model = this.children.map(e => e.model);
    this.#show = children;
  }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
}

class IRSymbolHierarchy {
  protected _show: IRSymbolLayer[] = [];
  get show() { return this._show; }
  constructor(
    readonly svg: SVGGElement,
    readonly children: IRSymbolLayer[],
  ) { }
  setShow(visible_layers: IRSymbolLayer[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.svg.replaceChildren(...this._show.map(e => e.svg));
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value === e.layer);
    this.setShow(visible_layer);
  }
}

function getIRSymbolSVG(text: string) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
  svg.textContent = text;
  svg.id = "I-R Symbol";
  svg.style.fontFamily = "Times New Roman";
  svg.style.fontSize = `${ir_analysis_em}em`;
  svg.style.textAnchor = "middle";
  svg.style.visibility = "hidden";
  return svg;
}

function getSVGG(id: string, children: { svg: SVGElement }[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e.svg));
  return svg;
}

export function buildIRSymbol(
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
  controllers: {
    readonly audio: AudioReflectableRegistry,
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
    readonly melody_color: MelodyColorController,
    readonly hierarchy: HierarchyLevelController,
  }
) {
  const layers = h_melodies.map((e, l) => {
    const parts = e.map(e => {
      const model = new IRSymbolModel(e, l);
      const svg = getIRSymbolSVG(model.archetype.symbol);
      const view = new IRSymbolView(svg);
      return new IRSymbol(model, view)
    });
    const svg = getSVGG(`layer-${l}`, parts);
    return new IRSymbolLayer(svg, parts, l)
  });
  const svg = getSVGG("implication-realization archetype", layers)

  const ir_hierarchy = new IRSymbolHierarchy(svg, layers);
    controllers.window.addListeners(...ir_hierarchy.children.flatMap(e => e.children).map(e => e.onWindowResized.bind(e)));
    controllers.hierarchy.addListeners(ir_hierarchy.onChangedLayer.bind(ir_hierarchy));
    controllers.time_range.addListeners(...ir_hierarchy.children.flatMap(e => e.children).map(e => e.onTimeRangeChanged.bind(e)));
    controllers.melody_color.addListeners(...ir_hierarchy.children.flatMap(e => e.children).map(e => e.setColor.bind(e)));
    controllers.audio.addListeners(...ir_hierarchy.children.map(e => e.onAudioUpdate.bind(e)));
    ir_hierarchy.children.map(e => e.onAudioUpdate())

  return ir_hierarchy.svg;
}
