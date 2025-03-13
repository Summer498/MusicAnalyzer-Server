import { NoteSize, BlackKeyPrm, PianoRollBegin } from "../../../../../application/view-parameters";
import { MVVM_View } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";
import { GravityViewTriangle } from "./gravity-triangle";
import { GravityViewLine } from "./gravity-line";

export class GravityView extends MVVM_View<GravityModel, "g"> {
  readonly triangle: GravityViewTriangle;
  readonly line: GravityViewLine;
  readonly line_seed: { readonly x1: number, readonly x2: number, readonly y1: number, readonly y2: number };
  constructor(model: GravityModel) {
    super(model, "g");
    this.line_seed = {
      x1: this.model.time.begin + this.model.time.duration / 2,
      x2: this.model.next.time.begin,
      y1: isNaN(this.model.note) ? -99 : (PianoRollBegin.value + 0.5 - this.model.note) * BlackKeyPrm.height,
      y2: isNaN(this.model.note) ? -99 : (PianoRollBegin.value + 0.5 - this.model.gravity.destination!) * BlackKeyPrm.height,
    };

    this.triangle = new GravityViewTriangle(model);
    this.line = new GravityViewLine(model, this.line_seed);

    this.svg.id = "gravity";
    this.svg.appendChild(this.triangle.svg);
    this.svg.appendChild(this.line.svg);
  }
  getLinePos() {
    return {
      x1: this.line_seed.x1 * NoteSize.value,
      x2: this.line_seed.x2 * NoteSize.value,
      y1: this.line_seed.y1,
      y2: this.line_seed.y2,
    };
  }
  updateWidth() { this.svg.setAttribute("width", String(this.model.time.duration * NoteSize.value)); }
  updateHeight() { this.svg.setAttribute("height", String(BlackKeyPrm.height)); }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    const line_pos = this.getLinePos();
    this.triangle.update(line_pos);
    this.line.update(line_pos);
  }
}
