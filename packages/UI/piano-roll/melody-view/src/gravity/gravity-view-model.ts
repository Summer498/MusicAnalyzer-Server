import { MVVM_ViewModel } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";
import { GravityView } from "./gravity-view";
import { Gravity, TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { LinePos } from "./line-pos";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class GravityVM extends MVVM_ViewModel<GravityModel, GravityView> {
  #line_seed: LinePos;
  constructor(
    e: TimeAndAnalyzedMelody,
    layer: number,
    readonly next: TimeAndAnalyzedMelody,
    readonly gravity: Gravity,
  ) {
    const model = new GravityModel(e, layer, next, gravity);
    super(model, new GravityView(model));
    this.#line_seed = {
      x1: this.model.time.begin + this.model.time.duration / 2,
      x2: this.model.next.time.begin,
      y1: isNaN(this.model.note) ? -99 : (0.5 - convertToCoordinate(transposed(this.model.note))),
      y2: isNaN(this.model.note) ? -99 : (0.5 - convertToCoordinate(transposed(this.model.gravity.destination!))),
    };
  }
  getLinePos() {
    return {
      x1: scaled(this.#line_seed.x1),
      x2: scaled(this.#line_seed.x2),
      y1: this.#line_seed.y1,
      y2: this.#line_seed.y2,
    };
  }
  updateWidth() { this.view.updateWidth(scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    this.view.onWindowResized(this.getLinePos())
  }
}
