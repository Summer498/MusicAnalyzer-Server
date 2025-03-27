import { MVVM_View } from "@music-analyzer/view/src/mvc";
import { BeatBarModel } from "./beat-bar-model";

export class BeatBarView 
  extends MVVM_View<"line", BeatBarModel> {
  constructor(model: BeatBarModel) {
    super("line", model);
    this.svg.id = "bar";
    this.svg.style.stroke = "rgb(0, 0, 0)";
    this.svg.style.display = "none";  //NOTE: 一旦非表示にしている
  }
  updateX(x1: number, x2: number) {
    this.svg.setAttribute("x1", String(x1));
    this.svg.setAttribute("x2", String(x2));
  }
  updateY(y1: number, y2: number) {
    this.svg.setAttribute("y1", String(y1));
    this.svg.setAttribute("y2", String(y2));
  }
}
