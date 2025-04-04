import { Checkbox } from "../../switcher";
import { MelodyBeepSwitcherSubscriber } from "./melody-beep-switcher-subscriber";

export class MelodyBeepSwitcher 
  extends Checkbox<MelodyBeepSwitcherSubscriber> {
  constructor(id: string, label: string) {
    super(id, label);
  }
  update() {
    const visibility = this.input.checked;
    this.subscribers.forEach(e => e.onMelodyBeepCheckChanged(visibility));
  };
};

