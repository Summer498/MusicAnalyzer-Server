import { MelodyVM } from "@music-analyzer/melody-view/src/melody/melody-view-model";
import { Checkbox } from "../switcher";

export class MelodyBeepSwitcher extends Checkbox {
  constructor(id: string, label: string) {
    super(id, label);
  }
  readonly subscribers: MelodyVM[] = [];
  register(...subscribers: MelodyVM[]) {
    this.subscribers.push(...subscribers);
  }
  update() {
    const visibility = this.input.checked;
    this.subscribers.forEach(e => e.onMelodyBeepCheckChanged(visibility));
  };
};

