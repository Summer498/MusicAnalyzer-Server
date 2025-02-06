import { MelodyController } from "./melody-controller";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { MelodyModel } from "./melody-model";
import { Layer, LayerGroup } from "@music-analyzer/view";

export { DMelodyGroup } from "../d-melody/d-melody";

export class MelodyLayer extends Layer {
  constructor(
    melodies: IMelodyModel[],
    layer: number
  ) {
    const children = melodies.map(e => new MelodyController(
      new MelodyModel(e),
    ));
    super(children, layer);
  }
}

export class MelodyGroup extends LayerGroup {
  readonly children: MelodyLayer[];
  get show() { return this._show; }
  constructor(
    hierarchical_melodies: IMelodyModel[][],
  ) {
    super();
    this.children = hierarchical_melodies.map((melodies, layer) =>
      new MelodyLayer(melodies, layer)
    );
    this.svg.id = "melody";
    this.children.forEach(e => this.svg.appendChild(e.svg));
    this._show = [];
  }
  #updateShow() {
    this.show.forEach(e => e.children.forEach(e => (e as MelodyController).onMelodyBeepCheckChanged(false)));
    this.show.forEach(e => e.children.forEach(e => (e as MelodyController).onMelodyVolumeBarChanged(0)));
  }
  onChangedLayer(value: number) {
    this.#updateShow();
    super.onChangedLayer(value);
  }
}
