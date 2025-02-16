import { Switcher } from "@music-analyzer/controllers";
import { SwitcherMediator } from "./switcher-mediator";
import { SvgCollection } from "@music-analyzer/view";

export class DMelodyMediator extends SwitcherMediator<SvgCollection> {
  constructor(
    switcher: Switcher,
    d_melody_collection: SvgCollection
  ) {
    super(switcher, [d_melody_collection]);
  }
  override update() {
    const visibility = this.controller.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
