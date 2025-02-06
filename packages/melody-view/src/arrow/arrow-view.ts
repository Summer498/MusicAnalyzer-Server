import { CurrentTimeX, NoteSize, black_key_prm, PianoRollBegin, NowAtX } from "@music-analyzer/view-parameters";
import { ArrowModel } from "./arrow-model";
import { MVCView } from "@music-analyzer/view";

const triangle_width = 5;
const triangle_height = 5;

type Vector2D = {
  readonly x: number;
  readonly y: number;
}

export class ArrowView extends MVCView {
  protected readonly model: ArrowModel;
  readonly svg: SVGGElement;
  readonly triangle: SVGPolygonElement;
  readonly line: SVGLineElement;
  readonly src: Vector2D;
  readonly dst: Vector2D;
  constructor(
    model: ArrowModel,
    fill: string,
    stroke: string,
  ) {
    super();
    this.model = model;
    this.triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    this.triangle.classList.add("triangle");
    this.triangle.id = "gravity-arrow";
    this.triangle.style.stroke = stroke;
    this.triangle.style.strokeWidth = String(5);
    this.triangle.style.fill = fill;
    this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.line.id = "gravity-arrow";
    this.line.classList.add("line");
    this.line.style.stroke = stroke;
    this.line.style.strokeWidth = String(5);

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "gravity";
    this.svg.appendChild(this.triangle);
    this.svg.appendChild(this.line);
    this.src = {
      x: (this.model.end - this.model.begin) / 2 + this.model.begin,
      y: this.model.note === undefined ? -99 : (PianoRollBegin.value + 0.5 - this.model.note) * black_key_prm.height
    };
    this.dst = {
      x: this.model.next.begin,
      y: (PianoRollBegin.value + 0.5 - this.model.gravity.destination!) * black_key_prm.height
    };
  }
  onAudioUpdate() {
    const src: Vector2D = {
      x: CurrentTimeX.value + this.src.x * NoteSize.value - NowAtX.value,
      y: this.src.y
    };
    const dst: Vector2D = {
      x: CurrentTimeX.value + this.dst.x * NoteSize.value - NowAtX.value,
      y: this.dst.y
    };

    const dx = dst.x - src.x;
    const dy = dst.y - src.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    const cos = -dy / r;
    const sin = dx / r;
    const p = [
      dst.x,
      dst.y,
      dst.x + cos * triangle_width - sin * triangle_height,
      dst.y + sin * triangle_width + cos * triangle_height,
      dst.x + cos * -triangle_width - sin * triangle_height,
      dst.y + sin * -triangle_width + cos * triangle_height
    ];
    const is_visible = this.model.hierarchy_level.range.value === `${this.model.layer}`;
    this.svg.style.visibility = is_visible ? "visible" : "hidden";
    this.triangle.setAttribute("points", p.join(","));
    this.line.setAttribute("x1", `${src.x}`);
    this.line.setAttribute("x2", `${dst.x}`);
    this.line.setAttribute("y1", `${src.y}`);
    this.line.setAttribute("y2", `${dst.y}`);
  }
}

