import { black_key_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { Gravity as SerializedGravity } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "./serialized-time-and-analyzed-melody";
import { Time } from "@music-analyzer/time-and";
import { CollectionHierarchy, CollectionLayer } from "@music-analyzer/view";

export class GravityModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly destination?: number;
  readonly layer: number;
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
    layer: number,
    readonly next: SerializedTimeAndAnalyzedMelody,
    readonly gravity: SerializedGravity,
  ) {
    this.time = e.time;
    this.head = e.head;
    this.note = e.note;
    this.destination = gravity.destination;
    this.layer = layer || 0;
  }
}

export class LinePos {
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
  getAngle() {
    const w = this.x2 - this.x1;
    const h = this.y2 - this.y1;
    return Math.atan2(h, w) * 180 / Math.PI;
  }
};

export class GravityViewLine {
  readonly svg: SVGLineElement
  constructor() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "line")
    svg.id = "gravity-arrow";
    svg.classList.add("line");
    svg.style.stroke = "rgb(0, 0, 0)";
    svg.style.strokeWidth = String(5);
    this.svg = svg;
  }
  update(line_pos: LinePos) {
    this.svg.setAttribute("x1", String(line_pos.x1));
    this.svg.setAttribute("x2", String(line_pos.x2));
    this.svg.setAttribute("y1", String(line_pos.y1));
    this.svg.setAttribute("y2", String(line_pos.y2));
  }
  onWindowResized() { }
}

const triangle_width = 4;
const triangle_height = 5;
export class GravityViewTriangle {
  readonly svg: SVGPolygonElement;
  constructor() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
    svg.classList.add("triangle");
    svg.id = "gravity-arrow";
    svg.style.stroke = "rgb(0, 0, 0)";
    svg.style.fill = "rgb(0, 0, 0)";
    svg.style.strokeWidth = String(5);

    svg.setAttribute("points", this.getInitPos().join(","));
    this.svg = svg;
  }
  getInitPos() { return [0, 0, - triangle_width, + triangle_height, + triangle_width, + triangle_height,]; }
  update(line_pos: LinePos) {
    const angle = line_pos.getAngle() + 90;
    this.svg.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
  }
  onWindowResized() { }
}

export class GravityView {
  readonly svg: SVGGElement;
  readonly triangle: GravityViewTriangle;
  readonly line: GravityViewLine;
  constructor() {
    this.triangle = new GravityViewTriangle();
    this.line = new GravityViewLine();

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = "gravity";
    svg.appendChild(this.triangle.svg);
    svg.appendChild(this.line.svg);
    this.svg = svg;
  }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
  onWindowResized(line_pos: LinePos) {
    this.triangle.update(line_pos);
    this.line.update(line_pos);
  }
}

export class Gravity {
  get svg() { return this.view.svg; }
  constructor(
    readonly model: GravityModel,
    readonly view: GravityView,
    readonly line_seed: LinePos,
  ) {
  }
  updateWidth() { this.view.updateWidth(PianoRollConverter.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(black_key_height) }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    this.view.onWindowResized(this.line_seed.scaled(NoteSize.get(), 1))
  }
  onTimeRangeChanged = this.onWindowResized
}

export class GravityLayer
  extends CollectionLayer<Gravity> {
  constructor(
    layer: number,
    children: Gravity[],
  ) {
    super(layer, children);
  }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}

export class GravityHierarchy
  extends CollectionHierarchy<GravityLayer> {
  constructor(
    id: string,
    children: GravityLayer[],
  ) {
    super(id, children);
  }
  onUpdateGravityVisibility(visible: boolean) { this.svg.style.visibility = visible ? "visible" : "hidden"; }
}

export function buildGravity(
  mode: "chord_gravity" | "scale_gravity",
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
) {
  const layers = h_melodies.map((melodies, l) => {
    const next = melodies.slice(1);
    const gravity = next.map((n, i) => {
      const e = melodies[i]
      const g = e.melody_analysis[mode];
      if (!g) { return }

      const model = new GravityModel(e, l, n, g);
      const view = new GravityView();
      const convert = (arg: number) => [
        ((e: number) => PianoRollConverter.midi2BlackCoordinate(e)),
        ((e: number) => 0.5 + e),
      ].reduce((c, f) => f(c), arg)

      const line = new LinePos(
        e.time.begin + e.time.duration / 2,
        n.time.begin,
        isNaN(e.note) ? -99 : convert(e.note),
        isNaN(e.note) ? -99 : convert(g.destination),
      )
      return new Gravity(model, view, line)
    }).filter(e => e !== undefined)
    return new GravityLayer(l, gravity);
  });
  return new GravityHierarchy(mode, layers);
}
