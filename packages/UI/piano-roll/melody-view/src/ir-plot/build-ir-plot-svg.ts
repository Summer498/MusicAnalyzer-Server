import { IRPlotSVG } from "./ir-plot-svg";
import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { IRPlotHierarchy } from "./ir-plot-hierarchy";

export function buildIRPlot(this: IHierarchyBuilder) {
  const children = [new IRPlotHierarchy(this.h_melodies, this.controllers)]
  return new IRPlotSVG(children);
}
