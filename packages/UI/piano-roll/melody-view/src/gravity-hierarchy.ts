import { black_key_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { Gravity as SerializedGravity } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "./serialized-time-and-analyzed-melody";
import { Time } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";
import { GravityController, HierarchyLevelController, TimeRangeController } from "@music-analyzer/controllers";

interface IGravityModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly destination?: number;
  readonly layer: number;
  readonly next: SerializedTimeAndAnalyzedMelody;
  readonly gravity: SerializedGravity;
}

const getGravityModel = (
  layer: number,
  e: SerializedTimeAndAnalyzedMelody,
  next: SerializedTimeAndAnalyzedMelody,
  gravity: SerializedGravity,
) => ({
  ...e,
  next,
  gravity,
  destination: gravity.destination,
  layer: layer || 0,
} as IGravityModel)

interface ILinePos {
  readonly x1: number
  readonly x2: number
  readonly y1: number
  readonly y2: number
}

const getLinePos = (
  x1: number,
  x2: number,
  y1: number,
  y2: number,
) => ({
  x1: x1,
  x2: x2,
  y1: y1,
  y2: y2,
} as ILinePos)

const scaled = (e: ILinePos) => (w: number, h: number) => getLinePos(
  e.x1 * w,
  e.x2 * w,
  e.y1 * h,
  e.y2 * h,
);

const updateWidth_GravityView = (svg: SVGGElement) => (w: number) => { svg.setAttribute("width", String(w)); }
const updateHeight_GravityView = (svg: SVGGElement) => (h: number) => { svg.setAttribute("height", String(h)); }
const onWindowResized_GravityView = (triangle: SVGPolygonElement, line: SVGLineElement) => (line_pos: ILinePos) => {
  const angle = Math.atan2(line_pos.y2 - line_pos.y1, line_pos.x2 - line_pos.x1) * 180 / Math.PI + 90;
  triangle.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
  line.setAttribute("x1", String(line_pos.x1));
  line.setAttribute("x2", String(line_pos.x2));
  line.setAttribute("y1", String(line_pos.y1));
  line.setAttribute("y2", String(line_pos.y2));
}

interface IGravity {
  readonly model: IGravityModel,
  readonly svg: SVGGElement,
  readonly triangle: SVGPolygonElement,
  readonly line: SVGLineElement,
  readonly line_seed: ILinePos,
}

const onWindowResized_Gravity = (svg: SVGGElement) => (model: IGravityModel) => (triangle: SVGPolygonElement, line: SVGLineElement, line_seed: ILinePos) => {
  updateWidth_GravityView(svg)(PianoRollConverter.scaled(model.time.duration))
  updateHeight_GravityView(svg)(black_key_height)
  onWindowResized_GravityView(triangle, line)(scaled(line_seed)(NoteSize.get(), 1))
}

interface IGravityLayer {
  readonly layer: number,
  readonly svg: SVGGElement,
  readonly show: IGravity[],
  readonly children: IGravity[],
}

const onAudioUpdate = (svg: SVGGElement) => { svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }

const onUpdateGravityVisibility_GravityHierarchy = (svg: SVGGElement) => (visible: boolean) => { svg.style.visibility = visible ? "visible" : "hidden"; }
const onChangedLayer_GravityHierarchy = (svg: SVGGElement, show: IGravityLayer[], children: IGravityLayer[]) => (value: number) => {
  show = children.filter(e => value === e.layer);
  show.forEach(e => onAudioUpdate(e.svg));
  svg.replaceChildren(...show.map(e => e.svg));
}

function getTriangle() {
  const triangle_width = 4;
  const triangle_height = 5;

  const triangle_svg = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
  triangle_svg.classList.add("triangle");
  triangle_svg.id = "gravity-arrow";
  triangle_svg.style.stroke = "rgb(0, 0, 0)";
  triangle_svg.style.fill = "rgb(0, 0, 0)";
  triangle_svg.style.strokeWidth = String(5);
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
  triangle: SVGPolygonElement,
  line: SVGLineElement,
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = "gravity";
  svg.appendChild(triangle);
  svg.appendChild(line);
  return svg
}

function getLinePos2(
  e: { time: { begin: number, duration: number }, note: number },
  n: { time: { begin: number } },
  g: { destination: number },
) {
  const convert = (arg: number) => [
    ((e: number) => PianoRollConverter.midi2BlackCoordinate(e)),
    ((e: number) => 0.5 + e),
  ].reduce((c, f) => f(c), arg)

  const line_pos = getLinePos(
    e.time.begin + e.time.duration / 2,
    n.time.begin,
    isNaN(e.note) ? -99 : convert(e.note),
    isNaN(e.note) ? -99 : convert(g.destination),
  )
  return line_pos;
}

function getSVGG(id: string, children: { svg: SVGElement }[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e.svg));
  return svg;
}

const getLayers = (mode: "chord_gravity" | "scale_gravity") => (
  melodies: SerializedTimeAndAnalyzedMelody[],
  layer: number
) => {
  const next = melodies.slice(1);
  const children = next.map((n, i) => {
    const e = melodies[i]
    const g = e.melody_analysis[mode];
    if (!g) { return }

    const line_seed = getLinePos2(e, n, g);
    const model = getGravityModel(layer, e, n, g);
    const triangle = getTriangle();
    const line = getLine();
    const svg = getGravitySVG(triangle, line);
    const view = { svg, triangle, line };
    return {
      model, view, line_seed, ...view
    }
  })
    .filter(e => e !== undefined)
    .map(e => ({ ...e, ...e.view }))
  const svg = getSVGG(`layer-${layer}`, children);
  return { layer, svg, children, show: children };
}

export function buildGravity(
  mode: "chord_gravity" | "scale_gravity",
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
  controllers: {
    readonly gravity: GravityController,
    readonly audio: AudioReflectableRegistry,
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
    readonly hierarchy: HierarchyLevelController,
  }
) {
  const children = h_melodies.map(getLayers(mode));
  const svg = getSVGG(mode, children);
  const gravity_hierarchy = { svg, children, show: children };
  
  switch (mode) {
    case "chord_gravity":
      controllers.gravity.chord_checkbox.addListeners(() => onUpdateGravityVisibility_GravityHierarchy(gravity_hierarchy.svg));
    case "scale_gravity":
      controllers.gravity.scale_checkbox.addListeners(() => onUpdateGravityVisibility_GravityHierarchy(gravity_hierarchy.svg));
    default: ;
  }
  controllers.hierarchy.addListeners(onChangedLayer_GravityHierarchy(gravity_hierarchy.svg, gravity_hierarchy.show, gravity_hierarchy.children));
  controllers.window.addListeners(...gravity_hierarchy.children.flatMap(e => e.children).map(e => () => onWindowResized_Gravity(e.svg)(e.model)(e.triangle, e.line, e.line_seed)));
  controllers.time_range.addListeners(...gravity_hierarchy.children.flatMap(e => e.children).map(e => () => onWindowResized_Gravity(e.svg)(e.model)(e.triangle, e.line, e.line_seed)));
  controllers.audio.addListeners(...gravity_hierarchy.children.map(e => () => onAudioUpdate(e.svg)));
  gravity_hierarchy.children.map(e => onAudioUpdate(e.svg))


  return gravity_hierarchy.svg;
}
