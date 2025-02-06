import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { TSRController } from "./tsr-tree-controller";
import { TSRModel } from "./tsr-tree-model";
import { Layer, LayerGroup } from "@music-analyzer/view";


export class TSRLayer extends Layer {
  constructor(
    melodies: IMelodyModel[],
    layer: number,
  ) {
    const children = melodies.map(e => new TSRController(
      new TSRModel(e, layer),
      e.melody_analysis.implication_realization
    ));
    super(children, layer);
  }
  renewStrong(layer: number) {
    this.children.forEach((e) => (e as TSRController).renewStrong(layer === this.layer));
  }
}

export class TSRGroup extends LayerGroup {
  readonly svg: SVGGElement;
  readonly children: TSRLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][]
  ) {
    super();
    this.children = hierarchical_melodies.map((e, l) => new TSRLayer(e, l));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-reduction";
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
  onChangedLayer(value: number): void {
    const visible_layer = this.children.filter(
      layer => value >= layer.layer
    );
    this.show.forEach(layer => (layer as TSRLayer).renewStrong(value));
    visible_layer.forEach(layer => (layer as TSRLayer).renewStrong(value));
    this.setShow(visible_layer);
  }
}
