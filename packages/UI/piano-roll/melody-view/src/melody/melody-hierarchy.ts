import { ColorChangeSubscriber, hasArchetype, HierarchyLevelController, HierarchyLevelSubscriber, MelodyBeepController, MelodyBeepSwitcherSubscriber, MelodyBeepVolumeSubscriber, MelodyColorController } from "@music-analyzer/controllers";
import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MelodyLayer } from "./melody-layer";

export class MelodyHierarchy
  extends CollectionHierarchy<MelodyLayer>
  implements
  HierarchyLevelSubscriber,
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber,
  ColorChangeSubscriber {
  get show() { return this._show; }
  #volume: number;
  #check: boolean;
  #active_layer: number;
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: [HierarchyLevelController, MelodyBeepController, MelodyColorController]
  ) {
    super("melody", hierarchical_melodies.map((e, l) => new MelodyLayer(e, l)));
    this.#check = false;
    this.#volume = 0;
    this.#active_layer = hierarchical_melodies.length;
    controllers.forEach(e => e.register(this));
  }
  onMelodyBeepCheckChanged(do_melody_beep: boolean) {
    this.#check = do_melody_beep;
    this.show.forEach(e => e.onMelodyBeepCheckChanged(e.layer === this.#active_layer && do_melody_beep));
  }
  onMelodyVolumeBarChanged(beep_volume: number) {
    this.#volume = beep_volume;
    this.show.forEach(e => e.onMelodyVolumeBarChanged(e.layer === this.#active_layer && beep_volume || 0));
  }
  onChangedLayer(layer: number) {
    super.onChangedLayer(layer);
    this.#active_layer = layer;

    this.onMelodyBeepCheckChanged(this.#check);
    this.onMelodyVolumeBarChanged(this.#volume);
  }
  setColor(getColor: (e: hasArchetype) => string) { this.children.forEach(e => e.setColor(getColor)); }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
