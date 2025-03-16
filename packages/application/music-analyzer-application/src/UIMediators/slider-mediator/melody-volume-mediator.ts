import { MelodyHierarchy } from "@music-analyzer/melody-view";
import { Slider } from "@music-analyzer/controllers";
import { ControllerMediator } from "../controller-mediator";

export class MelodyVolumeMediator extends ControllerMediator<MelodyHierarchy> {
  constructor(
    publisher: Slider[],
    subscribers: [MelodyHierarchy],
  ) {
    super(publisher);
    this.register(...subscribers);
  }

  override update() {
    const value = Number(this.publisher[0].input.value);
    this.subscribers.forEach(e => e.onMelodyVolumeBarChanged(value));
  }
}
