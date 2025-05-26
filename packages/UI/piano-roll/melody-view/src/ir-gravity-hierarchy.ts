import { black_key_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { SerializedTimeAndAnalyzedMelody } from "./serialized-time-and-analyzed-melody";
import { Time } from "@music-analyzer/time-and";
import { PianoRollTranslateX } from "@music-analyzer/view";
import { SetColor } from "@music-analyzer/controllers";
import { Triad } from "@music-analyzer/irm";
import { intervalOf } from "@music-analyzer/tonal-objects";

interface IRGravityModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly layer: number;
  readonly archetype: Triad;
}

const getGravityModel = (
  layer: number,
  e: SerializedTimeAndAnalyzedMelody,
) => ({
  ...e,
  archetype: e.melody_analysis.implication_realization as Triad,
  layer: layer || 0,
} as IRGravityModel)

interface ILinePos {
  readonly x1: number,
  readonly x2: number,
  readonly y1: number,
  readonly y2: number,
}

const getAngle = (e: ILinePos) => {
  const w = e.x2 - e.x1;
  const h = e.y2 - e.y1;
  return Math.atan2(h, w) * 180 / Math.PI;
}

class LinePos {
  constructor(
    readonly x1: number,
    readonly x2: number,
    readonly y1: number,
    readonly y2: number,
  ) { }
  scaled(w: number, h: number) {
    return new LinePos(
      this.x1 * w,
      this.x2 * w,
      this.y1 * h,
      this.y2 * h,
    )
  }
  getAngle() { return getAngle(this) }
};

const updateViewLine = (svg: SVGLineElement) => (line_pos: LinePos) => {
  svg.setAttribute("x1", String(line_pos.x1));
  svg.setAttribute("x2", String(line_pos.x2));
  svg.setAttribute("y1", String(line_pos.y1));
  svg.setAttribute("y2", String(line_pos.y2));
}

const triangle_width = 4;
const triangle_height = 5;
const getInitPos = () => [0, 0, - triangle_width, + triangle_height, + triangle_width, + triangle_height,]
const updateTriangle = (svg: SVGPolygonElement) => (line_pos: LinePos) => {
  const angle = line_pos.getAngle() + 90;
  svg.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
}

class IRGravityView {
  constructor(
    readonly svg: SVGGElement,
    readonly triangle: SVGPolygonElement,
    readonly line: SVGLineElement,
  ) { }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
  onWindowResized(line_pos: LinePos) {
    updateTriangle(this.triangle)(line_pos);
    updateViewLine(this.line)(line_pos);
  }
  readonly setColor = (color: string) => this.svg.style.fill = color;
}

class IRGravity {
  get svg() { return this.view.svg; }
  constructor(
    readonly model: IRGravityModel,
    readonly view: IRGravityView,
    readonly line_seed: LinePos,
  ) { }
  updateWidth() { this.view.updateWidth(PianoRollConverter.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(black_key_height) }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    this.view.onWindowResized(this.line_seed.scaled(NoteSize.get(), 1))
  }
  onTimeRangeChanged = this.onWindowResized
  readonly setColor: SetColor = f => this.view.setColor(f(this.model.archetype))
}

class IRGravityLayer {
  readonly children_model: { readonly time: Time }[];
  #show: IRGravity[];
  get show() { return this.#show; };

  constructor(
    readonly layer: number,
    readonly svg: SVGGElement,
    readonly children: IRGravity[],
  ) {
    this.children_model = this.children.map(e => e.model);
    this.#show = children;
  }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
}

export class IRGravityHierarchy {
  protected _show: IRGravityLayer[] = [];
  get show() { return this._show; }
  constructor(
    readonly svg: SVGGElement,
    readonly children: IRGravityLayer[]
  ) { }
  onUpdateGravityVisibility(visible: boolean) { this.svg.style.visibility = visible ? "visible" : "hidden"; }
  setShow(visible_layers: IRGravityLayer[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.svg.replaceChildren(...this._show.map(e => e.svg));
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value === e.layer);
    this.setShow(visible_layer);
  }
}

function getTriangle() {
  const triangle_svg = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
  triangle_svg.classList.add("triangle");
  triangle_svg.id = "gravity-arrow";
  triangle_svg.style.stroke = "rgb(0, 0, 0)";
  triangle_svg.style.fill = "rgb(0, 0, 0)";
  triangle_svg.style.strokeWidth = String(5);
  triangle_svg.setAttribute("points", getInitPos().join(","));
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

function getLinePos(
  e: { time: { begin: number, duration: number }, note: number },
  n: { time: { begin: number, duration: number }, note: number },
) {
  const convert = (arg: number) => [
    ((e: number) => e - 0.5),
    ((e: number) => PianoRollConverter.midi2BlackCoordinate(e)),
  ].reduce((c, f) => f(c), arg)

  const line_pos = new LinePos(
    e.time.begin + e.time.duration / 2,
    n.time.begin + n.time.duration / 2,
    isNaN(e.note) ? -99 : convert(e.note),
    isNaN(n.note) ? -99 : convert(n.note),
  )
  return line_pos;
}

const m3 = 3;
const getImplication = (interval: number) => {
  const sign = Math.sign(interval);
  const I = Math.abs(interval);
  return (I < 6) ? { inf: sign * (I - m3), sup: sign * (I + m3), over: sign * (I + m3), sgn: 1 } : { inf: 0, sup: sign * (I - m3), over: sign * (I + m3), sgn: -1 }
}

const getReImplication = (observed: number, realization: number) => {
  const sign = Math.sign(observed);
  const implication = getImplication(observed);
  const O = sign * observed;
  const R = sign * realization;
  if (0 <= R && R < O - m3) // IR
  { }
  else if (0 <= -R && -R < O - m3) // R
  { }
  else if (O - m3 <= R && R < O + m3) // P
  { return  }
  else if (O - m3 <= -R && -R < O + m3) // IP
  { }
  else if (O + m3 <= R) // VP
  { }
  else if (O + m3 <= -R) // VR
  { }
}

export function buildIRGravity(
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
) {
  const getLayers = (
    melodies: SerializedTimeAndAnalyzedMelody[],
    l: number
  ) => {
    const second = melodies.slice(1);
    const third = melodies.slice(2);
    const fourth = [...melodies.slice(3), undefined];
    const gravity = third.map((_, i) => {
      const past = melodies[i];
      const pre = second[i];
      const next = third[i];
      const re_next = fourth[i];
      const implication = getImplication(pre.note - past.note)
      const line_pos_implication = getLinePos(
        { time: pre.time, note: pre.note },
        { time: next.time, note: pre.note + (implication.inf + implication.sup) / 2 }
      );
      if(re_next){
        const IImplicationDist = re_next?.note + (implication.inf + implication.sup) / 2;
        const VImplicationDist = next.note + (implication.inf + implication.sup) / 2;
        const line_pos_reImplication = re_next && getLinePos(
          { time: next.time, note: next.note },
          { time: re_next.time, note: next.note }
        );
      }
      const model = getGravityModel(l, pre);
      const triangle = getTriangle();
      const line = getLine();
      //      line.style.color = get_color_of_Narmour_concept()
      const svg = getGravitySVG(triangle, line);
      const view = new IRGravityView(svg, triangle, line);
      return {
        model, view, line_pos: line_pos_implication
      }
    })
      .filter(e => e !== undefined)
      .map(e => new IRGravity(e.model, e.view, e.line_pos))
    const svg = getSVGG(`layer-${l}`, gravity.map(e => e.svg));
    return new IRGravityLayer(l, svg, gravity);
  }
  const layers = h_melodies.map(getLayers);
  const svg = getSVGG("ir_gravity", layers.map(e => e.svg));
  return new IRGravityHierarchy(svg, layers);
}
