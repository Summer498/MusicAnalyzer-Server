import { Checkbox } from "./abstract-switcher";

class DMelodySwitcher extends Checkbox {
  constructor(id: string, label: string) {
    super(id, label);
  }
}

export interface DMelodyControllerSubscriber {
  onDMelodyVisibilityChanged(visible: boolean): void
}

export class DMelodyController {
  readonly view: HTMLDivElement;
  readonly checkbox: DMelodySwitcher;
  constructor() {
    const d_melody_switcher = new DMelodySwitcher("d_melody_switcher", "detected melody before fix");
    this.view = document.createElement("div");
    this.view.id = "d-melody";
    this.view.appendChild(d_melody_switcher.body);
    this.checkbox = d_melody_switcher;
    this.init();
  };
  readonly subscribers: DMelodyControllerSubscriber[] = [];
  register(...subscribers: DMelodyControllerSubscriber[]) {
    this.subscribers.push(...subscribers);
    this.update()
  }
  update() {
    this.subscribers.forEach(e => e.onDMelodyVisibilityChanged(this.checkbox.input.checked));
  }
  init() {
    this.checkbox.input.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}
