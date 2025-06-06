import { black_key_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { SerializedTimeAndAnalyzedMelody } from "./serialized-time-and-analyzed-melody";
import { Time } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";
import { HierarchyLevelController, MelodyColorController, TimeRangeController } from "@music-analyzer/controllers";
import { type GetColor } from "@music-analyzer/controllers";
import { ImplicationDisplayController } from "@music-analyzer/controllers";
import { ITriad } from "@music-analyzer/irm";

interface IRGravityModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly layer: number;
  readonly archetype: ITriad;
}

interface ILinePos {
  readonly x1: number,
  readonly x2: number,
  readonly y1: number,
  readonly y2: number,
}

interface I_IRGravity {
  readonly svg: SVGGElement,
  readonly model: IRGravityModel,
  readonly view: {
    readonly svg: SVGGElement,
    readonly triangle: SVGPolygonElement,
    readonly line: SVGLineElement,
  },
  readonly line_seed: ILinePos,
}

interface I_IRGravityLayer {
  readonly layer: number
  readonly svg: SVGGElement
  readonly children: I_IRGravity[]
  readonly show: I_IRGravity[];
}

interface I_IRGravityHierarchy {
  readonly svg: SVGGElement,
  readonly children: I_IRGravityLayer[],
  show: I_IRGravityLayer[]
}

function getLinePos(
  e: { time: { begin: number, duration: number }, note: number },
  n: { time: { begin: number, duration: number }, note: number },
) {
  const convert = (arg: number) => [
    ((e: number) => e - 0.5),
    ((e: number) => PianoRollConverter.midi2BlackCoordinate(e)),
  ].reduce((c, f) => f(c), arg)

  const line_pos = {
    x1: e.time.begin + e.time.duration / 2,
    x2: n.time.begin + n.time.duration / 2,
    y1: isNaN(e.note) ? -99 : convert(e.note),
    y2: isNaN(n.note) ? -99 : convert(n.note),
  } as ILinePos
  return line_pos;
}

const triangle_width = 10;
const triangle_height = 10;
function getTriangle() {
  const triangle_svg = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
  triangle_svg.classList.add("triangle");
  triangle_svg.id = "gravity-arrow";
  triangle_svg.style.stroke = "rgb(0, 0, 0)";
  triangle_svg.style.fill = "rgb(0, 0, 0)";
  triangle_svg.style.strokeWidth = String(0);
  triangle_svg.setAttribute("points", [0, 0, - triangle_width, + triangle_height, + triangle_width, + triangle_height].join(","));
  return triangle_svg;
}

function getLine() {
  const line_svg = document.createElementNS("http://www.w3.org/2000/svg", "line")
  line_svg.id = "gravity-arrow";
  line_svg.classList.add("line");
  line_svg.style.stroke = "rgb(0, 0, 0)";
  line_svg.style.strokeWidth = String(5);
  return line_svg;
}

function getGravitySVG(
  ...children: SVGElement[]
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = "gravity";
  children.forEach(e => svg.appendChild(e));
  return svg
}

function getSVGG(id: string, children: SVGElement[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e));
  return svg;
}

const getImplicationColor = (archetype: ITriad) => {
  switch (archetype.symbol) {
    case "P": return "rgba(0,0,255,1)"
    case "IP": return "rgba(0,0,255,.25)"
    case "VP": return "rgba(0,0,255,.25)"
    case "R": return "rgba(255,0,0,1)"
    case "IR": return "rgba(255,0,0,.25)"
    case "VR": return "rgba(255,0,0,.25)"
    case "D": return "rgba(0,255,0,1)"
    case "ID": return "rgba(0,255,0,.5)"
    case "(P)": return "rgba(0,0,255,1)"
    case "(IP)": return "rgba(0,0,255,.25)"
    case "(VP)": return "rgba(0,0,255,.25)"
    case "(R)": return "rgba(255,0,0,1)"
    case "(IR)": return "rgba(255,0,0,.25)"
    case "(VR)": return "rgba(255,0,0,.25)"
    case "(D)": return "rgba(0,255,0,1)"
    case "(ID)": return "rgba(0,255,0,.25)"
    default: "rgba(0,0,0,.25)"
  }
}

const getArchetypeColor = (archetype: ITriad) => {
  switch (archetype.symbol) {
    case "(P)":
    case "P": return "rgba(0,0,255,1)"
    case "(IP)":
    case "IP": return "rgba(170,0,255,1)"
    case "(VP)":
    case "VP": return "rgba(0,170,255,1)"
    case "(R)":
    case "R": return "rgba(255,0,0,1)"
    case "(IR)":
    case "IR": return "rgba(255,170,0,1)"
    case "(VR)":
    case "VR": return "rgba(255,0,170,1)"
    case "(D)":
    case "D": return "rgba(0,255,0,1)"
    case "(ID)":
    case "ID": return "rgba(0,255,170,1)"
    default: "rgba(0,0,0,.25)"
  }
}

const xor = <A, B>(a: A, b: B) => !(a && b) && (a || b);
const eqv = <A, B>(a: A, b: B) => !(a || b) || (a && b);
const sameSign = (a: number, b: number) => Math.sign(a) === Math.sign(b);
const diffSign = (a: number, b: number) => Math.sign(a) !== Math.sign(b);

const isMR = (observed: number, realized: number) => {
  const I = Math.abs(observed);
  const R = Math.abs(realized);
  return (I + m3 <= R);
}

const isML = (observed: number, realized: number) => {
  const I = Math.abs(observed);
  const R = Math.abs(realized);
  return (R <= I - m3);
}

const isMN = (observed: number, realized: number) => {
  const I = Math.abs(observed);
  const R = Math.abs(realized);
  return (I - m3 < R && R < I + m3);
}


const isV = (observed: number, realized: number) => {
  return isMR(observed, realized);
}

const isI = (observed: number, realized: number) => {
  return !isV(observed, realized) && xor(isMN(observed, realized), sameSign(observed, realized))
}

const isB = (observed: number, realized: number) => {
  return !isV(observed, realized) && eqv(isMN(observed, realized), sameSign(observed, realized))
}

const isR = (observed: number, realized: number) => {
  return isV(observed, realized) ? (diffSign(observed, realized)) : isML(observed, realized);
}

const isP = (observed: number, realized: number) => {
  return !isR(observed, realized)
}

const isAA = (observed: number) => {
  return Math.abs(observed) < 6;
}

const isAB = (observed: number) => {
  return !isAA(observed);
}

const isReconsidered = (observed: number, realized: number) => {
  const AA = isAA(observed);
  const is_P = isP(observed, realized);
  return xor(AA, is_P)
}

const m3 = 3;
const getRange = (inf: number, sup: number, over: number, sgn: -1 | 0 | 1, dst: number) => {
  return ({
    inf,
    sup,
    over,
    sgn,
    dst,
  } as const)
}
const getProspectiveDestination = (observed: number) => {
  const s = Math.sign(observed);
  const O = Math.abs(observed);
  const L = O - m3;
  const G = O + m3;
  return (isAA(observed))
    ? getRange(+s * L, +s * G, +s * G, +1, s * O)
    : getRange(-s * 0, -s * L, -s * G, -1, O < m3 ? -s * M2 : -s * L / 2)
}

const getProspectiveArrow = (layer: number) => (delayed_melody: SerializedTimeAndAnalyzedMelody[][]) => (_: unknown, i: number) => {
  const first = delayed_melody[0][i];
  const second = delayed_melody[1][i];
  const third = delayed_melody[2][i];

  if (!isReconsidered(second.note - first.note, third.note - second.note)) { return; }
  const implication = getProspectiveDestination(second.note - first.note)

  const line_pos = getLinePos(
    { time: second.time, note: second.note },
    { time: third.time, note: second.note + implication.dst }
  );
  const model = {
    ...second,
    archetype: second.melody_analysis.implication_realization as ITriad,
    layer: layer || 0,
  } as IRGravityModel;
  const triangle = getTriangle();
  const line = getLine();
  const alpha = isReconsidered(second.note - first.note, third.note - second.note) ? .25 : 1;
  const color = isAA(second.note - first.note) ? `rgba(0,0,255,${alpha})` : `rgba(255,0,0,${alpha})`;
  triangle.style.stroke = color;
  triangle.style.fill = color;
  line.style.stroke = color;
  line.style.strokeWidth = String(2)
  const svg = getGravitySVG(triangle, line);
  const view = { svg, triangle, line };
  return { model, view, line_pos }
}

const m2 = 1;
const M2 = 2;
const getRetrospectiveDestination = (observed: number, realized: number) => {
  const s = Math.sign(observed);
  const O = Math.abs(observed);
  const L = O - m3;
  const G = O + m3;
  return (isP(observed, realized))
    ? getRange(+s * L, +s * G, +s * G, +1, s * O)
    : getRange(-s * 0, -s * L, -s * G, -1, O < m3 ? -s * M2 : -s * L / 2)
}

const getRetrospectiveArrow = (layer: number) => (delayed_melody: SerializedTimeAndAnalyzedMelody[][]) => (_: unknown, i: number) => {
  const first = delayed_melody[0][i];
  const second = delayed_melody[1][i];
  const third = delayed_melody[2][i];

  const implication = getRetrospectiveDestination(second.note - first.note, third.note - second.note);

  const line_pos = getLinePos(
    { time: second.time, note: second.note },
    { time: third.time, note: second.note + implication.dst },
  );

  const model = {
    ...second,
    archetype: second.melody_analysis.implication_realization as ITriad,
    layer: layer || 0,
  } as IRGravityModel;
  const triangle = getTriangle();
  const line = getLine();
  const alpha = isB(second.note - first.note, third.note - second.note) ? 1 : .25;
  const color = isP(second.note - first.note, third.note - second.note) ? `rgba(0,0,255,${alpha})` : `rgba(255,0,0,${alpha})`;
  triangle.style.stroke = color;
  triangle.style.fill = color;
  line.style.stroke = color; const svg = getGravitySVG(triangle, line);
  const view = { svg, triangle, line };
  return { model, view, line_pos };
}

const getReconstructedArrow = (layer: number) => (delayed_melody: SerializedTimeAndAnalyzedMelody[][]) => (_: unknown, i: number) => {
  const first = delayed_melody[0][i];
  const second = delayed_melody[1][i];
  const third = delayed_melody[2][i];
  const fourth = delayed_melody[3][i];

  const implication = getRetrospectiveDestination(second.note - first.note, third.note - second.note);

  if (isB(second.note - first.note, third.note - second.note)) { return; }

  const is_V = isV(second.note - first.note, third.note - second.note);
  const IImplication = third?.note + implication.dst;
  const VImplication = third?.note - implication.dst;
  // const VImplication = second?.note + implication.dst;
  // TODO: create 水たまり
  const line_pos = fourth && getLinePos(
    { time: third.time, note: third.note },
    { time: fourth.time, note: is_V ? VImplication : IImplication },
  );

  const model = {
    ...second,
    archetype: second.melody_analysis.implication_realization as ITriad,
    layer: layer || 0,
  } as IRGravityModel;
  const triangle = getTriangle();
  const line = getLine();
  const color = getArchetypeColor(model.archetype) || "rgba(0,0,0,.25)";
  triangle.style.stroke = color;
  triangle.style.fill = color;
  line.style.stroke = color;
  const svg = getGravitySVG(triangle, line);
  const view = { svg, triangle, line };
  return { model, view, line_pos };
}

const getLayers = (
  melodies: SerializedTimeAndAnalyzedMelody[],
  layer: number
) => {
  const delayed_melody = melodies.map((_, i) => melodies.slice(i));
  if (delayed_melody.length <= 3) { return; }
  const prospective = delayed_melody[2].map(getProspectiveArrow(layer)(delayed_melody)).filter(e => e !== undefined);
  const retrospective = delayed_melody[2].map(getRetrospectiveArrow(layer)(delayed_melody)).filter(e => e !== undefined);
  const reconstructed = delayed_melody[3].map(getReconstructedArrow(layer)(delayed_melody)).filter(e => e !== undefined);

  const children = [
    prospective,
    retrospective,
    reconstructed,
  ].flat()
    .map(e => ({ svg: e.view.svg, model: e.model, view: e.view, line_seed: e.line_pos }));
  const svg = getSVGG(`layer-${layer}`, children.map(e => e.svg));
  return ({
    layer,
    svg,
    children,
    prospective,
    retrospective,
    reconstructed,
    show: children,
  })
}

const onWindowResized_IRGravity = (
  e: I_IRGravity
) => {
  e.svg.setAttribute("width", String(PianoRollConverter.scaled(e.model.time.duration)));
  e.svg.setAttribute("height", String(black_key_height));

  const line_pos = { x1: e.line_seed.x1 * NoteSize.get(), x2: e.line_seed.x2 * NoteSize.get(), y1: e.line_seed.y1 * 1, y2: e.line_seed.y2 * 1 } as ILinePos
  const angle = Math.atan2(line_pos.y2 - line_pos.y1, line_pos.x2 - line_pos.x1);
  const marginX = triangle_height * Math.cos(angle);
  const marginY = triangle_height * Math.sin(angle);
  e.view.triangle.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle * 180 / Math.PI + 90})`);
  e.view.line.setAttribute("x1", String(line_pos.x1));
  e.view.line.setAttribute("y1", String(line_pos.y1));
  e.view.line.setAttribute("x2", String(line_pos.x2 - marginX));
  e.view.line.setAttribute("y2", String(line_pos.y2 - marginY));
}

const onAudioUpdate = (svg: SVGGElement) => { svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
const onChangedLayer = (ir_gravity: I_IRGravityHierarchy) => (value: number) => {
  ir_gravity.show = ir_gravity.children.filter(e => value === e.layer);
  ir_gravity.show.forEach(e => onAudioUpdate(e.svg));
  ir_gravity.svg.replaceChildren(...ir_gravity.show.map(e => e.svg));
}

export function buildIRGravity(
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
  controllers: {
    readonly audio: AudioReflectableRegistry,
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
    readonly melody_color: MelodyColorController,
    readonly hierarchy: HierarchyLevelController,
    readonly implication: ImplicationDisplayController,
  }
) {
  const children = h_melodies.map(getLayers).filter(e => e !== undefined);
  const svg = getSVGG("ir_gravity", children.map(e => e.svg));
  const ir_gravity = { svg, children, show: [] };

  controllers.window.addListeners(...ir_gravity.children.flatMap(e => e.children).map(e => () => onWindowResized_IRGravity(e)));
  controllers.time_range.addListeners(...ir_gravity.children.flatMap(e => e.children).map(e => () => onWindowResized_IRGravity(e)));
  controllers.implication.prospective_checkbox.addListeners(...ir_gravity.children.flatMap(e => e.prospective).flatMap(e => (value: boolean) => (e.view.svg.setAttribute("visibility", value ? "visible" : "hidden"))))
  controllers.implication.retrospective_checkbox.addListeners(...ir_gravity.children.flatMap(e => e.retrospective).flatMap(e => (value: boolean) => (e.view.svg.setAttribute("visibility", value ? "visible" : "hidden"))))
  controllers.implication.reconstructed_checkbox.addListeners(...ir_gravity.children.flatMap(e => e.reconstructed).flatMap(e => (value: boolean) => (e.view.svg.setAttribute("visibility", value ? "visible" : "hidden"))))

  controllers.hierarchy.addListeners(onChangedLayer(ir_gravity));
  controllers.melody_color.addListeners(...ir_gravity.children.flatMap(e => e.children).map(e => (f: GetColor) => e.svg.style.fill = f(e.model.archetype)));
  controllers.audio.addListeners(...ir_gravity.children.map(e => () => onAudioUpdate(e.svg)));
  ir_gravity.children.map(e => onAudioUpdate(e.svg))

  return ir_gravity.svg;
}
