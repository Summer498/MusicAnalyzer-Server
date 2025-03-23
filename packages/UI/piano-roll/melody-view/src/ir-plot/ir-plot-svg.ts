import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";
import { IRPlotHierarchy, RequiredByIRPlotHierarchy } from "./ir-plot-hierarchy";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

export interface RequiredByIRPlotSVG
  extends RequiredByIRPlotHierarchy { }
export class IRPlotSVG
  implements
  AudioReflectable,
  WindowReflectable {
  readonly svg: SVGSVGElement;
  readonly children: [IRPlotHierarchy];
  constructor(
    hierarchical_melody: TimeAndAnalyzedMelody[][],
    controllers: RequiredByIRPlotSVG,
  ) {
    const g = new IRPlotHierarchy(hierarchical_melody, controllers)
    this.children = [g];
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.appendChild(g.view.svg);
    this.svg.id = "IR-plot";
    this.svg.setAttribute("width", String(g.model.width));
    this.svg.setAttribute("height", String(g.model.height));
  }
  onAudioUpdate() { }
  onWindowResized() { }
}