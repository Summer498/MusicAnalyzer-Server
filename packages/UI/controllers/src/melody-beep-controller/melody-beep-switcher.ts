import { Checkbox } from "../switcher";

interface hoge {
  onMelodyBeepCheckChanged: (visible: boolean) => void;
}

export class MelodyBeepSwitcher extends Checkbox {
  constructor(id: string, label: string) {
    super(id, label);
  }
  readonly subscribers: hoge[] = [];
  register(...subscribers: hoge[]) {
    this.subscribers.push(...subscribers);
  }
  update() {
    const visibility = this.input.checked;
    this.subscribers.forEach(e => e.onMelodyBeepCheckChanged(visibility));
  };
};

