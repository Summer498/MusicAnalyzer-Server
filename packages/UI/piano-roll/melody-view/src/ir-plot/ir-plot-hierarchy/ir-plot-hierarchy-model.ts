import { IRPlotLayer } from "../ir-plot-layer/ir-plot-layer";

export class IRPlotHierarchyModel {
  readonly width: number;
  readonly height: number;
  constructor(children: IRPlotLayer[]) {
    const w = Math.max(...children.map(e => e.view.model.w));
    const h = Math.max(...children.map(e => e.view.model.h));
    this.width = w;
    this.height = h;
  }
}