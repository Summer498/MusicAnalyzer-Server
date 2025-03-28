import { MVVM_View } from "@music-analyzer/view/src/mvvm/view";
import { ReductionViewModel } from "./reduction-view-model";

export class Bracket 
  extends MVVM_View<"path", ReductionViewModel> {
  readonly svg: SVGPathElement;
  constructor(model: ReductionViewModel) {
    super("path", model);
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.svg.id = "group";
    this.svg.style.stroke = "rgb(0, 0, 64)";
    this.svg.style.strokeWidth = String(3);
    this.svg.style.fill = "rgb(242, 242, 242)";
  }
  updateStrong() {
    this.svg.style.strokeWidth = this.model.strong ? "3" : "1";
  }
  update(x: number, y: number, w: number, h: number) {
    const begin = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 0 / 10 };
    const ctrl11 = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 6 / 10 };
    const ctrl12 = { x: x + w * 0 / 10 + Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const corner1 = { x: x + w * 0 / 10 + Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const corner2 = { x: x + w * 10 / 10 - Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const ctrl21 = { x: x + w * 10 / 10 - Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const ctrl22 = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 6 / 10 };
    const end = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 0 / 10 };
    this.svg.setAttribute("d",
      `M${begin.x} ${begin.y}`
      + `C${ctrl11.x} ${ctrl11.y}`
      + ` ${ctrl12.x} ${ctrl12.y}`
      + ` ${corner1.x} ${corner1.y}`
      + `L${corner2.x} ${corner2.y}`
      + `C${ctrl21.x} ${ctrl21.y}`
      + ` ${ctrl22.x} ${ctrl22.y}`
      + ` ${end.x} ${end.y}`
    );
  }
  onWindowResized() {
    this.update(this.model.x, this.model.y, this.model.w, this.model.h);
  }
}
