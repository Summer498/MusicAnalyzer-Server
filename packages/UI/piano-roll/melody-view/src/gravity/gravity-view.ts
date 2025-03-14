import { NoteSize, BlackKeyPrm, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVVM_View } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";
import { GravityViewTriangle } from "./gravity-triangle";
import { GravityViewLine } from "./gravity-line";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class GravityView extends MVVM_View<GravityModel, "g"> {
  readonly triangle: GravityViewTriangle;
  readonly line: GravityViewLine;
  readonly line_seed: { readonly x1: number, readonly x2: number, readonly y1: number, readonly y2: number };
  constructor(model: GravityModel) {
    super(model, "g");
    this.line_seed = {
      x1: this.model.time.begin + this.model.time.duration / 2,
      x2: this.model.next.time.begin,
      y1: isNaN(this.model.note) ? -99 : (0.5 - convertToCoordinate(transposed(this.model.note))),
      y2: isNaN(this.model.note) ? -99 : (0.5 - convertToCoordinate(transposed(this.model.gravity.destination!))),
    };

    this.triangle = new GravityViewTriangle(model);
    this.line = new GravityViewLine(model, this.line_seed);

    this.svg.id = "gravity";
    this.svg.appendChild(this.triangle.svg);
    this.svg.appendChild(this.line.svg);
  }
  getLinePos() {
    return {
      x1: scaled(this.line_seed.x1),
      x2: scaled(this.line_seed.x2),
      y1: this.line_seed.y1,
      y2: this.line_seed.y2,
    };
  }
  updateWidth() { this.svg.setAttribute("width", String(scaled(this.model.time.duration))); }
  updateHeight() { this.svg.setAttribute("height", String(BlackKeyPrm.height)); }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    const line_pos = this.getLinePos();
    this.triangle.update(line_pos);
    this.line.update(line_pos);
  }
}
