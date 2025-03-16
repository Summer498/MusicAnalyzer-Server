import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";
import { IRPlotHierarchy } from "./ir-plot-hierarchy";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ColorChangeSubscriber, HierarchyLevelSubscriber } from "@music-analyzer/controllers";
import { hasArchetype } from "@music-analyzer/controllers/src/color-selector.ts/melody-color-controller";

export class IRPlot implements AudioReflectable, WindowReflectable, HierarchyLevelSubscriber, ColorChangeSubscriber {
  readonly svg: SVGSVGElement;
  readonly children: [IRPlotHierarchy];
  constructor(hierarchical_melody: TimeAndAnalyzedMelody[][]) {
    const g = new IRPlotHierarchy(hierarchical_melody)
    this.children = [g];
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.appendChild(g.view.svg);
    this.svg.id = "IR-plot";
    this.svg.setAttribute("width", String(g.width));
    this.svg.setAttribute("height", String(g.height));
  }
  onAudioUpdate() {
    this.children.forEach(e => e.onAudioUpdate());
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
  onChangedLayer(value: number) {
    this.children[0].onChangedLayer(value)
  }
  setColor (getColor: (e: hasArchetype) => string){
    this.children[0].setColor(getColor);
  }
  updateColor (){
    this.children[0].updateColor();
  }
}