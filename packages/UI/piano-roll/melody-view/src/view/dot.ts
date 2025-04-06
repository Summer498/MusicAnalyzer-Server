import { MVVM_View_Impl } from "@music-analyzer/view";
import { ReductionViewModel } from "./reduction-view-model";


export class Dot 
  extends MVVM_View_Impl<"circle", ReductionViewModel> {
  constructor(
    readonly model: ReductionViewModel,
  ) {
    super("circle", model);
    this.svg.id = "head";
    this.svg.style.stroke = "rgb(192, 0, 0)";
    this.svg.style.fill = "rgb(192, 0, 0)";
  }
  updateStrong() {
    this.svg.style.r = String(this.model.strong ? 5 : 3);
  }
  update(cx: number, cy: number) {
    this.svg.style.cx = String(cx);
    this.svg.style.cy = String(cy);
  }
  onWindowResized() {
    this.update(this.model.cx, this.model.y - this.model.h);
  }
}
