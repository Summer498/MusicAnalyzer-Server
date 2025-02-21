import { Checkbox } from "@music-analyzer/controllers";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { SwitcherMediator } from "./switcher-mediator";

export class DMelodyMediator extends SwitcherMediator<ReflectableTimeAndMVCControllerCollection> {
  constructor(
    switcher: Checkbox,
    d_melody_collection: ReflectableTimeAndMVCControllerCollection
  ) {
    super(switcher, [d_melody_collection]);
  }
  override update() {
    const visibility = this.controller.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
