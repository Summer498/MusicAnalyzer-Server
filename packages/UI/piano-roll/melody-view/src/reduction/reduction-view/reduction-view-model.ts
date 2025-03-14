import { BlackKeyPrm, bracket_height, NoteSize } from "@music-analyzer/view-parameters";
import { MVVM_Model } from "@music-analyzer/view";
import { ReductionModel } from "../reduction-model";
import { Archetype, Dyad, Monad, Null_ad, Triad } from "@music-analyzer/irm";

export class ReductionViewModel extends MVVM_Model {
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
  readonly archetype: Archetype | Triad | Dyad | Monad | Null_ad;
  constructor(
    readonly model: ReductionModel,
  ) {
    super();
    this.#x = this.getViewX(this.model.time.begin);
    this.#w = this.getViewW(this.model.time.duration);
    this.#cw = this.getViewW(this.model.head.duration);
    this.#cx = this.getViewX(this.model.head.begin) + this.#cw / 2;
    this.y = (2 + this.model.layer) * BlackKeyPrm.height * bracket_height;
    this.h = BlackKeyPrm.height * bracket_height;
    this.#strong = false;
    this.archetype = model.archetype
  }
  getViewX(x: number) { return x * NoteSize.get(); }
  getViewW(w: number) { return w * NoteSize.get(); }
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
}
