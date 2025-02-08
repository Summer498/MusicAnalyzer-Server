import { MelodyController } from "./melody-controller";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { MelodyModel } from "./melody-model";
import { CollectionLayer, CollectionLayerGroup } from "@music-analyzer/view";

export { DMelodyGroup } from "../d-melody/d-melody";

export class MelodyLayer extends CollectionLayer {
  constructor(
    melodies: IMelodyModel[],
    layer: number
  ) {
    const children = melodies.map(e => new MelodyController(new MelodyModel(e),));
    super(children, layer);
  }
  onMelodyBeepCheckChanged(do_melody_beep: boolean) {
    this.children.forEach(e =>
      (e as MelodyController).onMelodyBeepCheckChanged(do_melody_beep)
    );
  }
  onMelodyVolumeBarChanged(beep_volume: number) {
    this.children.forEach(e =>
      (e as MelodyController).onMelodyVolumeBarChanged(beep_volume)
    );
  }
}

export class MelodyGroup extends CollectionLayerGroup {
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
  }
  onMelodyBeepCheckChanged(do_melody_beep: boolean) {
    this.show.forEach(e => (e as MelodyLayer).onMelodyBeepCheckChanged(do_melody_beep));
  }
  onMelodyVolumeBarChanged(beep_volume: number) {
    this.show.forEach(e => (e as MelodyLayer).onMelodyVolumeBarChanged(beep_volume));
  }
  #resetShowBeepParameters() {
    this.onMelodyBeepCheckChanged(false);
    this.onMelodyVolumeBarChanged(0);
  }
  onChangedLayer(value: number) {
    super.onChangedLayer(value);
  }
}
