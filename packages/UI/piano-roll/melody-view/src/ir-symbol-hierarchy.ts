import { PianoRollConverter, size } from "@music-analyzer/view-parameters";
import { ITriad } from "@music-analyzer/irm";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { HierarchyLevelController, MelodyColorController, SetColor, TimeRangeController } from "@music-analyzer/controllers";
import { Time } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";

interface I_IRSymbolModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly archetype: ITriad;
  readonly layer: number;
}

const getIRSymbolModel = (e: SerializedTimeAndAnalyzedMelody, layer: number) => ({
  ...e,
  archetype: e.melody_analysis.implication_realization as ITriad,
  layer: layer || 0,
} as I_IRSymbolModel)

const ir_analysis_em = size;

const updateX_IRSymbolView = (svg: SVGTextElement) => (x: number) => { svg.setAttribute("x", String(x)); }
const updateY_IRSymbolView = (svg: SVGTextElement) => (y: number) => { svg.setAttribute("y", String(y)); }
const setColor_IRSymbolView = (svg: SVGTextElement) => (color: string) => svg.setAttribute("fill", color);

const updateX = (svg: SVGTextElement) => (model: I_IRSymbolModel) => {
  updateX_IRSymbolView(svg)(
    PianoRollConverter.scaled(model.time.begin)
    + PianoRollConverter.scaled(model.time.duration) / 2
  )
}

const updateY = (svg: SVGTextElement) => (model: I_IRSymbolModel) => { updateY_IRSymbolView(svg)(PianoRollConverter.midi2NNBlackCoordinate(model.note)) }
const onWindowResized = (svg: SVGTextElement) => (model: I_IRSymbolModel) => {
  updateX(svg)(model);
}

const onTimeRangeChanged = onWindowResized
const setColor = (svg: SVGTextElement) => (model: I_IRSymbolModel) => (f => setColor_IRSymbolView(svg)(f(model.archetype))) as SetColor

interface I_IRSymbol {
  readonly model: I_IRSymbolModel,
  readonly svg: SVGTextElement,
}

interface I_IRSymbolLayer {
  readonly children_model: { readonly time: Time }[];
  readonly svg: SVGGElement;
  readonly show: I_IRSymbol[];
  readonly children: I_IRSymbol[];
  readonly layer: number;
}

const getIRSymbolLayer = (
  svg: SVGGElement,
  children: I_IRSymbol[],
  layer: number,
) => ({
  svg: svg,
  layer: layer,
  show: children,
  children: children,
  children_model: children.map(e => e.model),
})

const onAudioUpdate = (svg: SVGElement) => { svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }

const setShow = (svg: SVGGElement) => (show: I_IRSymbolLayer[]) => (visible_layers: I_IRSymbolLayer[]) => {
  show = visible_layers;
  show.forEach(e => onAudioUpdate(e.svg));
  svg.replaceChildren(...show.map(e => e.svg));
}

const onChangedLayer = (svg: SVGGElement) => (show: I_IRSymbolLayer[]) => (children: I_IRSymbolLayer[]) => (value: number) => {
  const visible_layer = children.filter(e => value === e.layer);
  setShow(svg)(show)(visible_layer);
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

const getParts = (l: number) => (e: SerializedTimeAndAnalyzedMelody) => {
  const model = getIRSymbolModel(e, l);
  const svg = getIRSymbolSVG(model.archetype.symbol);
  updateX(svg)(model);
  updateY(svg)(model);

  return { model, svg } as I_IRSymbol
}

const getLayers = (e: SerializedTimeAndAnalyzedMelody[], l: number) => {
  const parts = e.map(getParts(l));
  const svg = getSVGG(`layer-${l}`, parts);
  return getIRSymbolLayer(svg, parts, l)
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
  const children = h_melodies.map(getLayers);
  const svg = getSVGG("implication-realization archetype", children)

  const ir_hierarchy = { svg, children, show: children };
  controllers.hierarchy.addListeners(() => onChangedLayer(ir_hierarchy.svg)(ir_hierarchy.show)(ir_hierarchy.children));
  controllers.window.addListeners(...ir_hierarchy.children.flatMap(e => e.children).map(e => () => onWindowResized(e.svg)(e.model)));
  controllers.time_range.addListeners(...ir_hierarchy.children.flatMap(e => e.children).map(e => () => onTimeRangeChanged(e.svg)(e.model)));
  controllers.melody_color.addListeners(...ir_hierarchy.children.flatMap(e => e.children).map(e => () => setColor(e.svg)(e.model)));
  controllers.audio.addListeners(...ir_hierarchy.children.map(e => () => onAudioUpdate(e.svg)));
  ir_hierarchy.children.map(e => onAudioUpdate(e.svg))

  return ir_hierarchy.svg;
}
