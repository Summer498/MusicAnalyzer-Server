import { IRPlotHierarchy } from "./ir-plot-hierarchy";

export class IRPlotSVG {
  readonly svg: SVGSVGElement;
  constructor(
    readonly children: IRPlotHierarchy[],
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.id = "IR-plot";
    children.forEach(e => this.svg.appendChild(e.view.svg));
    children.forEach(e => this.svg.setAttribute("width", String(e.model.width)));
    children.forEach(e => this.svg.setAttribute("height", String(e.model.height)));
  }
  onAudioUpdate() { }
  onWindowResized() { }
}