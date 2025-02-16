import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { IRPlotController } from "./ir-plot-controller";
import { IRPlotModel } from "./ir-plot-model";

export class IRPlotLayer {
  readonly svg: SVGGElement;
  readonly layer: number;
  readonly child: IRPlotController;
  readonly w: number;
  readonly h: number;
  constructor(
    melody_series: IMelodyModel[],
    layer: number,
    max: number
  ) {
    this.child = new IRPlotController(new IRPlotModel(melody_series));
    const base = Math.log(Math.min(this.child.view.w, this.child.view.h) / 10) / Math.log(max);
    this.child.view.updateRadius(Math.pow(base, max - layer / 2));
    // const base = Math.min(this.child.view.w, this.child.view.h) / 10 / max;
    // this.child.view.updateRadius(base * (max - layer/2));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `layer-${layer}`;
    this.svg.appendChild(this.child.view.svg);
    this.w = this.child.view.w;
    this.h = this.child.view.h;
    this.svg.style.width = String(this.w);
    this.svg.style.height = String(this.h);
    this.layer = layer;
  }
  onAudioUpdate() {
    this.child.onAudioUpdate();
  }
}

