import { WindowReflectableRegistry } from "@music-analyzer/view";
import { black_key_height, octave_height, PianoRollBegin, PianoRollConverter, PianoRollHeight } from "@music-analyzer/view-parameters";
import { PianoRollWidth } from "@music-analyzer/view-parameters";
import { chord_name_margin } from "@music-analyzer/chord-view";
import { chord_text_size } from "@music-analyzer/chord-view";
import { CurrentTimeX } from "@music-analyzer/view-parameters";
import { AnalysisView, MusicStructureElements } from "./analysis-view";
import { mod, getRange } from "@music-analyzer/math";
import { PianoRollEnd } from "@music-analyzer/view-parameters";

interface CurrentTimeLine {
  readonly svg: SVGLineElement
  onWindowResized(): void
}
const createCurrentTimeLine = (
  visible: boolean,
  window_registry: WindowReflectableRegistry,
): CurrentTimeLine => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "line")
  svg.id = "current_time"
  svg.style.strokeWidth = String(5)
  svg.style.stroke = "rgb(0, 0, 0)"
  svg.style.visibility = visible ? "visible" : "hidden"
  const onWindowResized = () => {
    svg.setAttribute("x1", `${CurrentTimeX.get()}`)
    svg.setAttribute("x2", `${CurrentTimeX.get()}`)
    svg.setAttribute("y1", "0")
    svg.setAttribute("y2", `${PianoRollHeight.get()}`)
  }
  window_registry.addListeners(onWindowResized)
  return { svg, onWindowResized }
}
interface RectangleView {
  readonly svg: SVGRectElement
  setX(x: number): void
  setY(y: number): void
  setW(w: number): void
  setH(h: number): void
}
const createRectangleView = (svg: SVGRectElement): RectangleView => ({
  svg,
  setX: (x) => svg.setAttribute("x", String(x)),
  setY: (y) => svg.setAttribute("y", String(y)),
  setW: (w) => svg.setAttribute("width", String(w)),
  setH: (h) => svg.setAttribute("height", String(h)),
})

interface RectangleModel {
  readonly x: number
  readonly y: number
  readonly w: number
  readonly h: number
}
const createRectangleModel = (y: number, w: number, h: number): RectangleModel => ({
  x: 0,
  y,
  w,
  h,
})
interface Rectangle {
  readonly model: RectangleModel
  readonly view: RectangleView
  readonly svg: SVGRectElement
}
const createRectangle = (model: RectangleModel, view: RectangleView): Rectangle => ({
  model,
  view,
  svg: view.svg,
})

const bg_height = octave_height / 12;

interface BG extends Rectangle {
  onWindowResized(): void
}
const createBG = (svg: SVGRectElement, i: number): BG => {
  const y = PianoRollConverter.midi2BlackCoordinate(i)
  const model = createRectangleModel(y, 1, bg_height)
  const view = createRectangleView(svg)
  const rect = createRectangle(model, view)
  const onWindowResized = () => {
    view.setX(model.x)
    view.setY(model.y)
    view.setW(PianoRollWidth.get())
    view.setH(model.h)
  }
  return { ...rect, onWindowResized }
}

// list up black key
// 1 3 6 8 10
// i => mod(i * 5, 12)
// 5 3 6 4 2
// sort
// 2 3 4 5 6
const isBlack = (i: number) => mod(i * 5 - 2, 12) < 5;
interface BGs {
  readonly svg: SVGGElement
  readonly children: BG[]
  onWindowResized(): void
}
const createBGs = (publisher: WindowReflectableRegistry): BGs => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g")
  svg.id = `BGs`
  const children = getRange(
    PianoRollBegin.get(),
    PianoRollEnd.get(),
    PianoRollBegin.get() < PianoRollEnd.get() ? 1 : -1)
    .map(i => {
      const child = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      child.id = `BG-${i}`
      child.style.fill = isBlack(i) ? "rgb(192, 192, 192)" : "rgb(242, 242, 242)"
      child.style.stroke = "rgb(0, 0, 0)"
      return createBG(child, i)
    })
  children.forEach(e => svg.appendChild(e.svg))
  const onWindowResized = () => { children.forEach(e => e.onWindowResized()) }
  publisher.addListeners(onWindowResized)
  return { svg, children, onWindowResized }
}

// list up white keys
// 0 2 4 5 7 9 11 12 14 16 17 19 21 23 
// i => i / 2
// 0 1 2 2.5 3.5 4.5 5.5 6

const key_width = 36;
const black_key_width = key_width * 2 / 3;
const white_key_width = key_width;
const white_key_height = octave_height / 7;

interface Key extends Rectangle {
  readonly isBlack: boolean
}
const createKey = (svg: SVGRectElement, i: number): Key => {
  const y = (isBlack(i)
    ? PianoRollConverter.midi2BlackCoordinate(i)
    : [i]
        .map(e => PianoRollConverter.transposed(e))
        .map(e => e + 1)
        .map(e => PianoRollConverter.convertToCoordinate(e))
        .map(e => e + white_key_height)
        .map(e => e - mod(i, 12) * 2)
        .map(e => e + (mod(i, 12) > 4 ? 12 : 0))
        .map(e => -e)[0])
  const model = createRectangleModel(
    y,
    isBlack(i) ? black_key_width : white_key_width,
    isBlack(i) ? black_key_height : white_key_height,
  )
  const view = createRectangleView(svg)
  const rect = createRectangle(model, view)
  return { ...rect, isBlack: isBlack(i) }
}

interface Keys {
  readonly svg: SVGGElement
  readonly children: Key[]
}
const createKeys = (): Keys => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g")
  svg.id = "keys"
  const sgn = PianoRollBegin.get() < PianoRollEnd.get() ? 1 : -1
  const keys = getRange(
    PianoRollBegin.get() - sgn,
    PianoRollEnd.get() + sgn * 2,
    sgn,
  ).map(i => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    rect.id = `key-${i}`
    rect.style.fill = isBlack(i) ? "rgb(64, 64, 64)" : "rgb(255, 255, 255)"
    rect.style.stroke = "rgb(0, 0, 0)"
    return createKey(rect, i)
  })
  const children = [
    keys.filter(e => !e.isBlack),
    keys.filter(e => e.isBlack),
  ].flat()
  children.forEach(e => svg.appendChild(e.svg))
  return { svg, children }
}

const appendChildren = (svg: SVGElement) => (...children: SVGElement[]) => {
  children.forEach(e => svg.appendChild(e));
}
const onWindowResized = (svg: SVGElement) => () => {
  svg.setAttribute("x", String(0));
  svg.setAttribute("y", String(0));
  svg.setAttribute("width", String(PianoRollWidth.get()));
  svg.setAttribute("height", String(PianoRollHeight.get() + chord_text_size * 2 + chord_name_margin));
}

export interface PianoRoll {
  readonly svg: SVGSVGElement
}
export function PianoRoll(
  analyzed: MusicStructureElements,
  window: WindowReflectableRegistry,
  show_current_time_line: boolean,
): PianoRoll {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.id = "piano-roll"
  appendChildren(svg)(
    createBGs(window).svg,
    AnalysisView(analyzed).svg,
    createKeys().svg,
    createCurrentTimeLine(show_current_time_line, window).svg,
  )
  window.addListeners(onWindowResized(svg))
  return { svg }
}
