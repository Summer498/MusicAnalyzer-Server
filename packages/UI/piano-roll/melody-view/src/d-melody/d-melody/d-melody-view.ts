import { hsv2rgb } from "@music-analyzer/color";
import { rgbToString } from "@music-analyzer/color";
import { MVVM_View_Impl } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";

export class DMelodyView 
  extends MVVM_View_Impl<"rect", DMelodyModel> {
  constructor(model: DMelodyModel) {
    super("rect", model);
    this.svg.id = "melody-note";
    this.svg.style.fill = rgbToString(hsv2rgb(0, 0, 0.75));
    this.svg.style.stroke = "rgb(64, 64, 64)";
  }
  set onclick(value: () => void) { this.svg.onclick = value; };
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}
