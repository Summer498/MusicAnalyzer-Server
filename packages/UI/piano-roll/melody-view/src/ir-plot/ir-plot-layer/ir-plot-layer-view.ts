import { IRPlotVM } from "../ir-plot-view-model";

export class IRPlotLayerView {
  readonly svg: SVGGElement;
  constructor(
    child: IRPlotVM,
    readonly layer: number,
    max: number
  ) {
    const base = Math.log(Math.min(child.view.w, child.view.h) / 10) / Math.log(max);
    child.view.updateRadius(Math.pow(base, max - layer / 2));
    // const base = Math.min(child.view.w, child.view.h) / 10 / max;
    // child.view.updateRadius(base * (max - layer/2));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `layer-${layer}`;
    this.svg.appendChild(child.view.svg);
  }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}