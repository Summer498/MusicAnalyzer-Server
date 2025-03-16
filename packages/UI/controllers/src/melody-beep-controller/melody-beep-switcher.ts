import { MelodyVM } from "@music-analyzer/melody-view/src/melody/melody-view-model";
import { Checkbox } from "../switcher";

export class MelodyBeepSwitcher extends Checkbox {
  constructor(id: string, label: string) {
    super(id, label);
    this.init()
  }
  readonly subscribers: MelodyVM[] = [];
  register(...subscribers: MelodyVM[]) {
    this.subscribers.push(...subscribers);
    this.update()
  }
  update() {
    const visibility = this.input.checked;
    this.subscribers.forEach(e => e.onMelodyBeepCheckChanged(visibility));
  };
  init() {
    this.input.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
};

