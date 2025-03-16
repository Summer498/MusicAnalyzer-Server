import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";
import { IRPlotHierarchy } from "./ir-plot-hierarchy";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";

export class IRPlot implements AudioReflectable, WindowReflectable, HierarchyLevelSubscriber {
  readonly svg: SVGSVGElement;
  readonly children: [IRPlotHierarchy];
  constructor(hierarchical_melody: TimeAndAnalyzedMelody[][]) {
    const g = new IRPlotHierarchy(hierarchical_melody)
    this.children = [g];
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.appendChild(g.view.svg);
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
  onChangedLayer(value: number) {
    this.children[0].onChangedLayer(value)
  }
}