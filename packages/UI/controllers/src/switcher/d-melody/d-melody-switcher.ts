import { Checkbox } from "../abstract-switcher";
import { DMelodyControllerSubscriber } from "./d-melody-controller-subscriber";

export class DMelodySwitcher 
  extends Checkbox<DMelodyControllerSubscriber> {
  constructor(id: string, label: string) {
    super(id, label);
  }
  update() {
    this.subscribers.forEach(e => e.onDMelodyVisibilityChanged(this.input.checked));
  }
}
