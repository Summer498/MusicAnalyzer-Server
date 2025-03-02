import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRPlotVM } from "./ir-plot-view-model";
import { IRPlotModel } from "./ir-plot-model";
import { Archetype } from "@music-analyzer/irm";

export class IRPlotLayer {
  readonly svg: SVGGElement;
  readonly child: IRPlotVM;
  readonly w: number;
  readonly h: number;
  constructor(
    melody_series: TimeAndAnalyzedMelody[],
    readonly layer: number,
    max: number
  ) {
    this.child = new IRPlotVM(new IRPlotModel(melody_series));
    const base = Math.log(Math.min(this.child.view.w, this.child.view.h) / 10) / Math.log(max);
    this.child.view.updateRadius(Math.pow(base, max - layer / 2));
    // const base = Math.min(this.child.view.w, this.child.view.h) / 10 / max;
    // this.child.view.updateRadius(base * (max - layer/2));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `layer-${layer}`;
    this.svg.appendChild(this.child.view.svg);
    this.w = this.child.view.w;
    this.h = this.child.view.h;
    this.svg.setAttribute("width", String(this.w));
    this.svg.setAttribute("height", String(this.h));    
  }
  onAudioUpdate() {
    this.child.onAudioUpdate();
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.child.setColor(getColor);
  }
  updateColor() { this.child.updateColor(); }
}

