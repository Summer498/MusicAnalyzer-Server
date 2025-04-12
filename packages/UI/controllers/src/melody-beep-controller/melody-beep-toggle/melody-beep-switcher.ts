import { Checkbox } from "../../switcher";

export class MelodyBeepSwitcher
  extends Checkbox<boolean> {
  constructor(id: string, label: string) {
    super(id, label);
  }
  update() {
    const visibility = this.input.checked;
    this.listeners.forEach(e => e(visibility))
  };
};

