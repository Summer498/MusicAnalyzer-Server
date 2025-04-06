import { IRPlot } from "../part/ir-plot";
import { IRPlotLayerModel } from "./ir-plot-layer-model";

export class IRPlotLayerView {
  readonly svg: SVGGElement;
  constructor(
    child: IRPlot,
    readonly layer: number,
    max: number,
    readonly model: IRPlotLayerModel
  ) {
    const base = Math.log(Math.min(child.view.view_model.w, child.view.view_model.h) / 10) / Math.log(max);
    child.view.updateRadius(Math.pow(base, max - layer / 2));
    // const base = Math.min(child.view.w, child.view.h) / 10 / max;
    // child.view.updateRadius(base * (max - layer/2));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `layer-${layer}`;
    this.svg.appendChild(child.view.svg);

    this.updateWidth(this.model.w);
    this.updateHeight(this.model.h);
  }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}