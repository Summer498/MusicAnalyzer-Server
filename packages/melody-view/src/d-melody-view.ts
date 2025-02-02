import { hsv2rgb, rgbToString } from "@music-analyzer/color";

export class DMelodyView {
  readonly svg: SVGRectElement;
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "melody-note";
    this.svg.style.fill=rgbToString(hsv2rgb(0, 0, 0.75));
    this.svg.style.stroke = "#444";
  }
  set x(value: number) { this.svg.style.x = String(value); }
  set y(value: number) { this.svg.style.y = String(value); }
  set width(value: number) { this.svg.style.width = String(value); }
  set height(value: number) { this.svg.style.height = String(value); }
  set visibility(value: "visible" | "hidden") { this.svg.style.visibility = value; }
  set onclick(value: () => void) { this.svg.onclick = value; };
}
