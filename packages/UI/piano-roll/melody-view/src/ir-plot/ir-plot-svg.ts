import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRPlotHierarchy } from "./ir-plot-hierarchy";
import { RequiredByIRPlotSVG } from "../requirement";
import { I_IRPlotSVG } from "../interface";

export class IRPlotSVG
  implements I_IRPlotSVG {
  readonly svg: SVGSVGElement;
  readonly children: [IRPlotHierarchy];
  constructor(
    hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
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