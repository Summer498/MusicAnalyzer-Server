import { Checkbox } from "../abstract-switcher";

export class DMelodySwitcher 
  extends Checkbox<boolean> {
  constructor(id: string, label: string) {
    super(id, label);
  }
  update() {
    this.listeners.forEach(e=>e(this.input.checked))
  }
}
