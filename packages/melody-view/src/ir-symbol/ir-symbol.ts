import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { IRSymbolController } from "./ir-symbol-controller";
import { IRSymbolModel } from "./ir-symbol-model";
import { Layer, LayerGroup } from "@music-analyzer/view";

export class IRSymbolLayer extends Layer {
  constructor(
    melodies: IMelodyModel[],
    layer: number
  ) {
    const children = melodies.map(e => new IRSymbolController(new IRSymbolModel(e, layer)));
    super(children, layer);
  }
}

export class IRSymbolGroup extends LayerGroup{
  readonly children: IRSymbolLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
  ){
    super();
    this.svg.id = "implication-realization archetype";
    this.children = hierarchical_melodies.map((melodies, layer) => new IRSymbolLayer(melodies, layer));
    this.children.forEach(e=>this.svg.appendChild(e.svg));
  }
}
