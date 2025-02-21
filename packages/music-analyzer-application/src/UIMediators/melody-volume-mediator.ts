import { MelodyHierarchy } from "@music-analyzer/melody-view";
import { Slider } from "@music-analyzer/controllers";
import { SliderMediator } from "./slider-mediator";

export class MelodyVolumeMediator extends SliderMediator<MelodyHierarchy> {
  constructor(
    slider: Slider,
    melody_hierarchy: MelodyHierarchy,
  ) {
    super(slider, [melody_hierarchy]);
  }

  override update() {
    const value = Number(this.controller.input.value);
    this.subscribers.forEach(e => e.onMelodyVolumeBarChanged(value));
  }
}
