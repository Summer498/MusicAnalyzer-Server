import { Checkbox } from "../abstract-switcher";
import { GravitySwitcherSubscriber } from "./gravity-switcher-subscriber";

export class GravitySwitcher 
  extends Checkbox<GravitySwitcherSubscriber> {
  constructor(id: string, label: string) {
    super(id, label);
  };
  update() {
    this.subscribers.forEach(e => e.onUpdateGravityVisibility(this.input.checked));
  }
}
