export class IRPlotAxis {
  readonly svg: SVGLineElement;
  constructor(
    readonly x1: number,
    readonly y1: number,
    readonly x2: number,
    readonly y2: number,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.setAttribute("x1", String(x1));
    this.svg.setAttribute("y1", String(y1));
    this.svg.setAttribute("x2", String(x2));
    this.svg.setAttribute("y2", String(y2));
    this.svg.style.stroke = "rgb(0, 0, 0)";
  }
}
