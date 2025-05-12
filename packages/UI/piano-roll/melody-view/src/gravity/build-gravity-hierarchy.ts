import { GravitySwitcher } from "@music-analyzer/controllers";
import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { black_key_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { RequiredByGravityHierarchy } from "./required-by-gravity-hierarchy";
import { Hierarchy, Layer, Model, Part, View } from "../abstract/abstract-hierarchy";
import { NoteSize } from "@music-analyzer/view-parameters";
import { Gravity as SerializedGravity } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "../serialized-time-and-analyzed-melody";

export class GravityModel 
  extends Model {
  readonly note: number;
  readonly destination?: number;
  readonly layer: number;
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
    layer: number,
    readonly next: SerializedTimeAndAnalyzedMelody,
    readonly gravity: SerializedGravity,
  ) {
    super(
      e.time,
      e.head,
    );
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

export class GravityViewLine 
  extends View<"line"> {
  constructor() {
    super("line");
    this.svg.id = "gravity-arrow";
    this.svg.classList.add("line");
    this.svg.style.stroke = "rgb(0, 0, 0)";
    this.svg.style.strokeWidth = String(5);
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
export class GravityViewTriangle 
  extends View<"polygon"> {
  constructor() {
    super("polygon");
    this.svg.classList.add("triangle");
    this.svg.id = "gravity-arrow";
    this.svg.style.stroke = "rgb(0, 0, 0)";
    this.svg.style.fill = "rgb(0, 0, 0)";
    this.svg.style.strokeWidth = String(5);

    this.svg.setAttribute("points", this.getInitPos().join(","));
  }
  getInitPos() { return [0, 0, - triangle_width, + triangle_height, + triangle_width, + triangle_height,]; }
  update(line_pos: LinePos) {
    const angle = line_pos.getAngle() + 90;
    this.svg.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
  }
  onWindowResized() { }
}

export class GravityView 
  extends View<"g"> {
  readonly triangle: GravityViewTriangle;
  readonly line: GravityViewLine;
  constructor() {
    super("g");

    this.triangle = new GravityViewTriangle();
    this.line = new GravityViewLine();

    this.svg.id = "gravity";
    this.svg.appendChild(this.triangle.svg);
    this.svg.appendChild(this.line.svg);
  }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
  onWindowResized(line_pos: LinePos) {
    this.triangle.update(line_pos);
    this.line.update(line_pos);
  }
}

export class Gravity
  extends Part<GravityModel, GravityView>
  {
  constructor(
    model: GravityModel,
    view: GravityView,
    readonly line_seed: LinePos,
  ) {
    super(model, view);
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
  extends Layer<Gravity> {
  constructor(
    layer: number,
    children: Gravity[],
  ) {
    super(layer, children);
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}

export class GravityHierarchy
  extends Hierarchy<GravityLayer> {
  constructor(
    id: string,
    children: GravityLayer[],
    controllers: RequiredByGravityHierarchy,
  ) {
    super(id, children);
    controllers.switcher.addListeners(this.onUpdateGravityVisibility.bind(this));
    controllers.hierarchy.addListeners(this.onChangedLayer.bind(this));
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this));
  }
  onUpdateGravityVisibility(visible: boolean) { this.svg.style.visibility = visible ? "visible" : "hidden"; }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
}

export function buildGravity(
  this: IHierarchyBuilder,
  mode: "chord_gravity" | "scale_gravity",
  switcher: GravitySwitcher,
) {
  const layers = this.h_melodies.map((melodies, l) => {
    const next = melodies.slice(1);
    const gravity = next.map((n, i) => {
      const e = melodies[i]
      const g = e.melody_analysis[mode];
      if (!g) { return }
      
      const model = new GravityModel(e, l, n, g);
      const view = new GravityView();
      const line = new LinePos(
        e.time.begin + e.time.duration / 2,
        n.time.begin,
        isNaN(e.note) ? -99 : (0.5 - PianoRollConverter.convertToCoordinate(PianoRollConverter.transposed(e.note))),
        isNaN(e.note) ? -99 : (0.5 - PianoRollConverter.convertToCoordinate(PianoRollConverter.transposed(g.destination))),
      )
      return new Gravity(model, view, line)
    }).filter(e => e !== undefined)
    return new GravityLayer(l, gravity);
  });
  return new GravityHierarchy(mode, layers, { ...this.controllers, switcher });
}
