import { IRPlotLayer } from "../layer";

export class IRPlotCircles {
  readonly svg: SVGGElement;
  private _show: IRPlotLayer[];
  get show() { return this._show; }
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._show = [];
  }
  setShow(visible_layers: IRPlotLayer[]) {
    this._show = visible_layers;
    this.svg.replaceChildren(...this._show.map(e => e.view.svg));
  }
}
