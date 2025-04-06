import { IRPlotSVG } from "../ir-plot-svg";
import { IRPlotHierarchy } from "../hierarchy/ir-plot-hierarchy";
import { IHierarchyBuilder } from "./i-hierarchy-builder";

export function buildIRPlot(this: IHierarchyBuilder) {
  const children = [new IRPlotHierarchy(this.h_melodies, this.controllers)]
  return new IRPlotSVG(children);
}
