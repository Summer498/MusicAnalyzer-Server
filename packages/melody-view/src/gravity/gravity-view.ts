import { NoteSize, BlackKeyPrm, PianoRollBegin } from "@music-analyzer/view-parameters";
import { GravityModel } from "./gravity-model";
import { MVCView } from "@music-analyzer/view";

const triangle_width = 5;
const triangle_height = 5;

type Vector2D = {
  readonly x: number;
  readonly y: number;
}

export class GravityView extends MVCView {
  protected readonly model: GravityModel;
  readonly svg: SVGGElement;
  readonly triangle: SVGPolygonElement;
  readonly line: SVGLineElement;
  readonly src: Vector2D;
  readonly dst: Vector2D;
  constructor(
    model: GravityModel,
  ) {
    super();
    this.model = model;
    this.triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    this.triangle.classList.add("triangle");
    this.triangle.id = "gravity-arrow";
    this.triangle.style.stroke = "#000";
    this.triangle.style.strokeWidth = String(5);
    this.triangle.style.fill = "#000";
    this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.line.id = "gravity-arrow";
    this.line.classList.add("line");
    this.line.style.stroke = "#000";
    this.line.style.strokeWidth = String(5);

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "gravity";
    this.svg.appendChild(this.triangle);
    this.svg.appendChild(this.line);
    this.src = {
      x: this.model.begin + this.model.duration / 2,
      y: isNaN(this.model.note) ? -99 : (PianoRollBegin.value + 0.5 - this.model.note) * BlackKeyPrm.height
    };
    this.dst = {
      x: this.model.next.begin,
      y: (PianoRollBegin.value + 0.5 - this.model.gravity.destination!) * BlackKeyPrm.height
    };
    const view_pos = this.getViewPositions();
    this.triangle.setAttribute("points", view_pos.p.join(","));
    this.line.setAttribute("x1", String(view_pos.src.x));
    this.line.setAttribute("x2", String(view_pos.dst.x));
    this.line.setAttribute("y1", String(view_pos.src.y));
    this.line.setAttribute("y2", String(view_pos.dst.y));
  }
  getViewX(x: number) { return x * NoteSize.value; }
  getViewPositions() {
    const src: Vector2D = {
      x: this.getViewX(this.src.x),
      y: this.src.y
    };
    const dst: Vector2D = {
      x: this.getViewX(this.dst.x),
      y: this.dst.y
    };

    const w = dst.x - src.x;
    const h = dst.y - src.y;
    const r = Math.sqrt(w * w + h * h);
    const cos = -h / r;
    const sin = w / r;
    const p = [
      dst.x,
      dst.y,
      dst.x + cos * triangle_width - sin * triangle_height,
      dst.y + sin * triangle_width + cos * triangle_height,
      dst.x + cos * -triangle_width - sin * triangle_height,
      dst.y + sin * -triangle_width + cos * triangle_height
    ];
    return { p, src, dst } as ({ readonly p: number[], readonly src: Vector2D, readonly dst: Vector2D });
  }
  updateWidth() { this.svg.style.width = String(this.model.duration * NoteSize.value); }
  updateHeight() { this.svg.style.height = String(BlackKeyPrm.height); }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    const view_pos = this.getViewPositions();
    this.triangle.setAttribute("points", view_pos.p.join(","));
    this.line.setAttribute("x1", String(view_pos.src.x));
    this.line.setAttribute("x2", String(view_pos.dst.x));
    this.line.setAttribute("y1", String(view_pos.src.y));
    this.line.setAttribute("y2", String(view_pos.dst.y));
  }
}
