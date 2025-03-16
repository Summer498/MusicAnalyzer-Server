import { MelodyHierarchy } from "@music-analyzer/melody-view";
import { Slider } from "@music-analyzer/controllers";
import { ControllerMediator } from "../controller-mediator";

export class MelodyVolumeMediator extends ControllerMediator<MelodyHierarchy> {
  constructor(
    sliders: Slider[],
    melody_hierarchy: [MelodyHierarchy],
  ) {
    super(sliders, melody_hierarchy);
  }

  override update() {
    const value = Number(this.controllers[0].input.value);
    this.subscribers.forEach(e => e.onMelodyVolumeBarChanged(value));
  }
}
