import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MelodyLayer } from "./melody-layer";
import { Archetype } from "@music-analyzer/irm";

export class MelodyHierarchy extends CollectionHierarchy<MelodyLayer> {
  get show() { return this._show; }
  #volume: number;
  #check: boolean;
  #active_layer: number;
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
  ) {
    super("melody", hierarchical_melodies.map((melodies, l) => new MelodyLayer(l, melodies)));
    this.#check = false;
    this.#volume = 0;
    this.#active_layer = hierarchical_melodies.length;
  }
  onMelodyBeepCheckChanged(do_melody_beep: boolean) {
    this.#check = do_melody_beep;
    this.show.forEach(layer => {
      const e = layer as MelodyLayer;
      e.onMelodyBeepCheckChanged(e.layer === this.#active_layer && do_melody_beep);
    });
  }
  onMelodyVolumeBarChanged(beep_volume: number) {
    this.#volume = beep_volume;
    this.show.forEach(layer => {
      const e = (layer as MelodyLayer);
      e.onMelodyVolumeBarChanged(e.layer === this.#active_layer && beep_volume || 0);
    });
  }
  onChangedLayer(layer: number) {
    super.onChangedLayer(layer);
    this.#active_layer = layer;

    this.onMelodyBeepCheckChanged(this.#check);
    this.onMelodyVolumeBarChanged(this.#volume);
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() {
    this.children.forEach(e => e.updateColor());
  }
}
