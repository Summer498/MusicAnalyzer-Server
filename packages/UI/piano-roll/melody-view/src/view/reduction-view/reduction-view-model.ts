import { Triad } from "@music-analyzer/irm";
import { MVVM_Model } from "@music-analyzer/view";
import { BlackKeyPrm } from "@music-analyzer/view-parameters";
import { bracket_height } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { ReductionModel } from "../../model";

const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class ReductionViewModel
  extends MVVM_Model
  implements TimeRangeSubscriber {
  #x: number;
  #w: number;
  #cx: number;
  #cw: number;
  #strong: boolean;
  readonly y: number;
  readonly h: number;
  get x() { return this.#x; }
  get w() { return this.#w; }
  get cx() { return this.#cx; }
  get cw() { return this.#cw; }
  get strong() { return this.#strong; }
  set strong(value: boolean) { this.#strong = value; }
  readonly archetype: Triad;
  constructor(
    readonly model: ReductionModel,
  ) {
    super();
    this.#x = this.getViewX(this.model.time.begin);
    this.#w = this.getViewW(this.model.time.duration);
    this.#cw = this.getViewW(this.model.head.duration);
    this.#cx = this.getViewX(this.model.head.begin) + this.#cw / 2;
    this.y = convertToCoordinate((2 + this.model.layer)) * bracket_height;
    this.h = BlackKeyPrm.height * bracket_height;
    this.#strong = false;
    this.archetype = model.archetype as Triad
  }
  getViewX(x: number) { return scaled(x); }
  getViewW(w: number) { return scaled(w); }
  updateX() {
    this.#x = this.getViewX(this.model.time.begin);
    this.#cx = this.getViewX(this.model.head.begin) + this.#cw / 2;
  }
  updateWidth() {
    this.#w = this.getViewW(this.model.time.duration);
    this.#cw = this.getViewW(this.model.head.duration);
  }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
  }
  onTimeRangeChanged = this.onWindowResized;
}
