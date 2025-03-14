import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";
import { IRPlotHierarchy } from "./ir-plot-hierarchy";

export class IRPlot implements AudioReflectable, WindowReflectable {
  readonly svg: SVGSVGElement;
  readonly children: [IRPlotHierarchy];
  constructor(g: IRPlotHierarchy) {
    this.children = [g];
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.appendChild(g.svg);
    this.svg.id = "IR-plot";
    this.svg.setAttribute("width", String(g.width));
    this.svg.setAttribute("height", String(g.height));
  }
  onAudioUpdate() {
    this.children.forEach(e => e.onAudioUpdate());
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}