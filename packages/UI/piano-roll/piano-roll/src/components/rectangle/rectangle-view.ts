import { RectParameters } from "@music-analyzer/view-parameters";

export class RectangleView {
  readonly svg: SVGRectElement;
  constructor(
    id: string,
    protected readonly prm: typeof RectParameters,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = id;
    this.svg.style.fill = this.prm.fill;
    this.svg.style.stroke = this.prm.stroke;
  }
  setX(x: number) { this.svg.setAttribute("x", String(x)) }
  setY(y: number) { this.svg.setAttribute("y", String(y)) }
  setW(w: number) { this.svg.setAttribute("width", String(w)) }
  setH(h: number) { this.svg.setAttribute("height", String(h)) }
}