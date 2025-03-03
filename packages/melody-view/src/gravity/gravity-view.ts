import { NoteSize, BlackKeyPrm, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVVM_View } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";

const triangle_width = 4;
const triangle_height = 5;

export class GravityView extends MVVM_View<GravityModel, "g"> {
  readonly triangle: SVGPolygonElement;
  readonly line: SVGLineElement;
  readonly line_seed: { readonly x1: number, readonly x2: number, readonly y1: number, readonly y2: number };
  constructor(model: GravityModel) {
    super(model, "g");
    this.triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    this.triangle.classList.add("triangle");
    this.triangle.id = "gravity-arrow";
    this.triangle.style.stroke = "rgb(0, 0, 0)";
    this.triangle.style.strokeWidth = String(5);
    this.triangle.style.fill = "rgb(0, 0, 0)";
    this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.line.id = "gravity-arrow";
    this.line.classList.add("line");
    this.line.style.stroke = "rgb(0, 0, 0)";
    this.line.style.strokeWidth = String(5);

    this.svg.id = "gravity";
    this.svg.appendChild(this.triangle);
    this.svg.appendChild(this.line);
    this.line_seed = {
      x1: this.model.begin + this.model.duration / 2,
      x2: this.model.next.begin,
      y1: isNaN(this.model.note) ? -99 : (PianoRollBegin.value + 0.5 - this.model.note) * BlackKeyPrm.height,
      y2: isNaN(this.model.note) ? -99 : (PianoRollBegin.value + 0.5 - this.model.gravity.destination!) * BlackKeyPrm.height,
    };
    const view_pos = this.getLinePos();
    this.triangle.setAttribute("points", this.getInitPos().join(","));
    this.line.setAttribute("x1", String(view_pos.x1));
    this.line.setAttribute("x2", String(view_pos.x2));
    this.line.setAttribute("y1", String(view_pos.y1));
    this.line.setAttribute("y2", String(view_pos.y2));
  }
  getInitPos() { return [0, 0, - triangle_width, + triangle_height, + triangle_width, + triangle_height,]; }
  getLinePos() {
    return {
      x1: this.line_seed.x1 * NoteSize.value,
      x2: this.line_seed.x2 * NoteSize.value,
      y1: this.line_seed.y1,
      y2: this.line_seed.y2,
    };
  }
  getAngle() {
    const line_pos = this.getLinePos();
    const w = line_pos.x2 - line_pos.x1;
    const h = line_pos.y2 - line_pos.y1;
    return Math.atan2(h, w) * 180 / Math.PI + 90;
  }
  updateWidth() { this.svg.setAttribute("width", String(this.model.duration * NoteSize.value)); }
  updateHeight() { this.svg.setAttribute("height", String(BlackKeyPrm.height)); }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    const angle = this.getAngle();
    const line_pos = this.getLinePos();
    this.triangle.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
    this.line.setAttribute("x1", String(line_pos.x1));
    this.line.setAttribute("x2", String(line_pos.x2));
    this.line.setAttribute("y1", String(line_pos.y1));
    this.line.setAttribute("y2", String(line_pos.y2));
  }
}
