import { Checkbox } from "@music-analyzer/controllers";
import { SwitcherMediator } from "./switcher-mediator";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";

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
