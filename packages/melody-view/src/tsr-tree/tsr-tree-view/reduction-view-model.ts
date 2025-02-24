import { BlackKeyPrm, bracket_hight, NoteSize } from "@music-analyzer/view-parameters";
import { MVCModel } from "@music-analyzer/view";
import { ReductionModel } from "../tsr-tree-model";

export class ReductionViewModel extends MVCModel {
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
  constructor(
    readonly model: ReductionModel,
  ) {
    super();
    this.#x = this.getViewX(this.model.begin);
    this.#w = this.getViewW(this.model.duration);
    this.#cw = this.getViewW(this.model.head.duration);
    this.#cx = this.getViewX(this.model.head.begin) + this.#cw / 2;
    this.y = (2 + this.model.layer) * BlackKeyPrm.height * bracket_hight;
    this.h = BlackKeyPrm.height * bracket_hight;
    this.#strong = false;
  }
  getViewX(x: number) { return x * NoteSize.value; }
  getViewW(w: number) { return w * NoteSize.value; }
  updateX() {
    this.#x = this.getViewX(this.model.begin);
    this.#cx = this.getViewX(this.model.head.begin) + this.#cw / 2;
  }
  updateWidth() {
    this.#w = this.getViewW(this.model.duration);
    this.#cw = this.getViewW(this.model.head.duration);
  }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
  }
}
