import { WindowReflectableRegistry } from "@music-analyzer/view";
import { black_key_height, octave_height, PianoRollBegin, PianoRollConverter, PianoRollHeight } from "@music-analyzer/view-parameters";
import { PianoRollWidth } from "@music-analyzer/view-parameters";
import { chord_name_margin } from "@music-analyzer/chord-view";
import { chord_text_size } from "@music-analyzer/chord-view";
import { CurrentTimeX } from "@music-analyzer/view-parameters";
import { AnalysisView, MusicStructureElements } from "./analysis-view";
import { mod, getRange } from "@music-analyzer/math";
import { PianoRollEnd } from "@music-analyzer/view-parameters";

class CurrentTimeLine {
  readonly svg: SVGLineElement;
  constructor(
    visible: boolean,
    window_registry: WindowReflectableRegistry
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.id = "current_time";
    this.svg.style.strokeWidth = String(5);
    this.svg.style.stroke = "rgb(0, 0, 0)";
    this.svg.style.visibility = visible ? "visible" : "hidden";
    window_registry.addListeners(this.onWindowResized.bind(this))
  }
  onWindowResized() {
    this.svg.setAttribute("x1", `${CurrentTimeX.get()}`);
    this.svg.setAttribute("x2", `${CurrentTimeX.get()}`);
    this.svg.setAttribute("y1", "0");
    this.svg.setAttribute("y2", `${PianoRollHeight.get()}`);
  }
}
class RectangleView {
  constructor(
    readonly svg: SVGRectElement,
  ) { }
  setX(x: number) { this.svg.setAttribute("x", String(x)) }
  setY(y: number) { this.svg.setAttribute("y", String(y)) }
  setW(w: number) { this.svg.setAttribute("width", String(w)) }
  setH(h: number) { this.svg.setAttribute("height", String(h)) }
}

class RectangleModel {
  constructor(
    readonly y: number,
    readonly w: number,
    readonly h: number,
  ) { }
  get x() { return 0; }
}
abstract class Rectangle {
  get svg() { return this.view.svg; }

  constructor(
    readonly model: RectangleModel,
    readonly view: RectangleView,
  ) { }
}

const bg_height = octave_height / 12;

class BG extends Rectangle {
  constructor(
    svg: SVGRectElement,
    i: number
  ) {
    const y = PianoRollConverter.midi2BlackCoordinate(i);
    super(
      new RectangleModel(
        y,
        1,
        bg_height,
      ),
      new RectangleView(svg),
    )
  }
  onWindowResized() {
    this.view.setX(this.model.x);
    this.view.setY(this.model.y);
    this.view.setW(PianoRollWidth.get());
    this.view.setH(this.model.h);
  }
}

// list up black key
// 1 3 6 8 10
// i => mod(i * 5, 12)
// 5 3 6 4 2
// sort
// 2 3 4 5 6
const isBlack = (i: number) => mod(i * 5 - 2, 12) < 5;
class BGs {
  readonly svg: SVGGElement;
  readonly children: BG[];
  constructor(publisher: WindowReflectableRegistry) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = `BGs`;
    const children = getRange(
      PianoRollBegin.get(),
      PianoRollEnd.get(),
      PianoRollBegin.get() < PianoRollEnd.get() ? 1 : -1)
      .map(i => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        svg.id = `BG-${i}`;
        svg.style.fill = isBlack(i) ? "rgb(192, 192, 192)" : "rgb(242, 242, 242)";
        svg.style.stroke = "rgb(0, 0, 0)";

        return new BG(svg, i);
      })
    children.forEach(e => svg.appendChild(e.svg));
    this.svg = svg;
    this.children = children
    publisher.addListeners(this.onWindowResized.bind(this));
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}

// list up white keys
// 0 2 4 5 7 9 11 12 14 16 17 19 21 23 
// i => i / 2
// 0 1 2 2.5 3.5 4.5 5.5 6

const key_width = 36;
const black_key_width = key_width * 2 / 3;
const white_key_width = key_width;
const white_key_height = octave_height / 7;

class Key extends Rectangle {
  readonly isBlack: boolean;
  constructor(
    svg: SVGRectElement,
    i: number
  ) {
    const y = (isBlack(i)
      // black
      ? PianoRollConverter.midi2BlackCoordinate(i)
      // white
      : [i]
        .map(e => PianoRollConverter.transposed(e))
        .map(e => e + 1)
        .map(e => PianoRollConverter.convertToCoordinate(e))
        .map(e => e + white_key_height)
        .map(e => e - mod(i, 12) * 2)
        .map(e => e + (mod(i, 12) > 4 ? 12 : 0))
        .map(e => -e)
      [0])
    super(
      new RectangleModel(
        y,
        isBlack(i) ? black_key_width : white_key_width,
        isBlack(i) ? black_key_height : white_key_height,
      ),
      new RectangleView(svg),
    )
    this.isBlack = isBlack(i);
  }
}
class Keys {
  readonly svg: SVGGElement;
  readonly children: Key[];
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "keys";
    const sgn = PianoRollBegin.get() < PianoRollEnd.get() ? 1 : -1;
    const keys = getRange(
      PianoRollBegin.get() - sgn,
      PianoRollEnd.get() + sgn * 2,
      sgn)
      .map(i => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        svg.id = `key-${i}`;
        svg.style.fill = isBlack(i) ? "rgb(64, 64, 64)" : "rgb(255, 255, 255)";
        svg.style.stroke = "rgb(0, 0, 0)";

        return new Key(svg, i)
      })
    this.children = [
      keys.filter(e => !e.isBlack),
      keys.filter(e => e.isBlack),
    ].flat()
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
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

export class PianoRoll {
  readonly svg: SVGSVGElement;
  constructor(
    analyzed: MusicStructureElements,
    window: WindowReflectableRegistry,
    show_current_time_line: boolean
  ) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "piano-roll";
    appendChildren(svg)(
      new BGs(window).svg,
      new AnalysisView(analyzed).svg,
      new Keys().svg,
      new CurrentTimeLine(show_current_time_line, window).svg,
    );
    window.addListeners(onWindowResized(svg))
    this.svg = svg;
  }
}
