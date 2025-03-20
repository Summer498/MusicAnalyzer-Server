import { MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";
import { GravityView } from "./gravity-view";
import { Gravity as GravityAnalysis, TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { LinePos } from "../line-pos";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class Gravity 
  extends MVVM_ViewModel<GravityModel, GravityView>
  implements TimeRangeSubscriber
  {
  #line_seed: LinePos;
  constructor(
    e: TimeAndAnalyzedMelody,
    layer: number,
    readonly next: TimeAndAnalyzedMelody,
    readonly gravity: GravityAnalysis,
    controllers: [WindowReflectableRegistry]
  ) {
    const model = new GravityModel(e, layer, next, gravity);
    super(model, new GravityView(model));
    this.#line_seed = new LinePos(
      this.model.time.begin + this.model.time.duration / 2,
      this.model.next.time.begin,
      isNaN(this.model.note) ? -99 : (0.5 - convertToCoordinate(transposed(this.model.note))),
      isNaN(this.model.note) ? -99 : (0.5 - convertToCoordinate(transposed(this.model.gravity.destination!))),
    )
    controllers[0].register(this);
  }
  updateWidth() { this.view.updateWidth(scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    this.view.onWindowResized(this.#line_seed.scaled(NoteSize.get(), 1))
  }
  onTimeRangeChanged = this.onWindowResized
}
