import { Layer, LayerGroup } from "@music-analyzer/view";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { getChordGravityController } from "../chord-gravity/chord-gravity";
import { getScaleGravityController } from "../scale-gravity/scale-gravity";

export class ChordGravityLayer extends Layer {
  constructor(
    melodies: IMelodyModel[],
    layer: number,
  ) {
    const children = melodies.map((e, i, a) => getChordGravityController(e, i, a, layer)).flat(2);
    super(children, layer);
    this.svg.id = `layer-${layer}`;
  }
}

export class ChordGravityGroup extends LayerGroup {
  readonly children: ChordGravityLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
  ) {
    super();
    this.children = hierarchical_melodies.map((melodies, layer) => new ChordGravityLayer(melodies, layer));
    this.svg.id = "chord-gravity";
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
}

export class ScaleGravityLayer extends Layer {
  constructor(
    melodies: IMelodyModel[],
    layer: number,
  ) {
    const children = melodies.map((e, i, a) => getScaleGravityController(e, i, a, layer)).flat(2);
    super(children, layer);
    this.svg.id = `layer-${layer}`;
  }
}

export class ScaleGravityGroup extends LayerGroup {
  readonly children: ScaleGravityLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
  ) {
    super();
    this.children = hierarchical_melodies.map((melodies, layer) => new ScaleGravityLayer(melodies, layer));
    this.svg.id = "scale-gravity";
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
}
