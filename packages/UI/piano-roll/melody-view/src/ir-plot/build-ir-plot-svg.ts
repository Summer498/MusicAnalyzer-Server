import { IRPlotSVG } from "./ir-plot-svg";
import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { IRPlotHierarchy } from "./ir-plot-hierarchy";
import { IRPlotLayer } from "./ir-plot-layer";
import { IRPlot } from "./ir-plot";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView } from "./ir-plot-view";

export function buildIRPlot(this: IHierarchyBuilder) {
  const N = this.h_melodies.length;

  const layers = this.h_melodies.map((e, l) => {
    const model = new IRPlotModel(e);
    const view = new IRPlotView(model);
    const part = new IRPlot(model, view);
    return new IRPlotLayer([part], l, N)
  })
  const hierarchy = [new IRPlotHierarchy(layers, this.controllers)]
  return new IRPlotSVG(hierarchy);
}
