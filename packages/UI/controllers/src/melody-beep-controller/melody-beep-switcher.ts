import { Checkbox } from "../switcher";

interface MelodyBeepSwitcherSubscriber {
  onMelodyBeepCheckChanged: (visible:boolean)=>void
}

export class MelodyBeepSwitcher extends Checkbox {
  constructor(id: string, label: string) {
    super(id, label);
    this.init()
  }
  readonly subscribers: MelodyBeepSwitcherSubscriber[] = [];
  register(...subscribers: MelodyBeepSwitcherSubscriber[]) {
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

