import { IRPlotCircles } from "./ir-plot-circles";
import { IRPlotAxis } from "./ir-plot-axis";
import { IRPlotLayer } from "../ir-plot-layer";

export class IRPlotHierarchyView {
  readonly svg: SVGGElement;
  readonly x_axis: IRPlotAxis;
  readonly y_axis: IRPlotAxis;
  readonly circles: IRPlotCircles;
  constructor(
    w: number,
    h: number,
  ) {
    this.x_axis = new IRPlotAxis(0, h / 2, w, h / 2);//(width, height);
    this.y_axis = new IRPlotAxis(w / 2, 0, w / 2, h);//(width, height);
    this.circles = new IRPlotCircles();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "implication-realization plot";
    this.svg.replaceChildren(this.x_axis.svg, this.y_axis.svg, this.circles.svg);
    this.svg.setAttribute("width", String(w));
    this.svg.setAttribute("height", String(h));
  }

  updateCircleVisibility(visible_layer: IRPlotLayer[]) {
    this.circles.setShow(visible_layer);
  }
}