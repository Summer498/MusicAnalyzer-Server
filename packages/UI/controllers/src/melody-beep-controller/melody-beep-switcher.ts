import { Checkbox } from "../switcher";

export interface MelodyBeepSwitcherSubscriber {
  onMelodyBeepCheckChanged: (hearable:boolean)=>void
}

export class MelodyBeepSwitcher extends Checkbox<MelodyBeepSwitcherSubscriber> {
  constructor(id: string, label: string) {
    super(id, label);
  }
  update() {
    const visibility = this.input.checked;
    this.subscribers.forEach(e => e.onMelodyBeepCheckChanged(visibility));
  };
};

