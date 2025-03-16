import { DMelodyGroup } from "@music-analyzer/melody-view";
import { Checkbox } from "./abstract-switcher";

export class DMelodySwitcher extends Checkbox {
  constructor(id: string, label: string) {
    super(id, label);
  }
}

interface DMelodyControllerSubscriber {
  svg: { style: { visibility: string } }
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
    const visibility = this.checkbox.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
  init() {
    this.checkbox.input.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}
