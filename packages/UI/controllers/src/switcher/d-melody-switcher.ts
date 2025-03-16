import { Checkbox } from "./abstract-switcher";
import { DMelodyMediator } from "@music-analyzer/music-analyzer-application";

export class DMelodySwitcher extends Checkbox {
  constructor(id: string, label: string) {
    super(id, label);
  }
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
  };
  readonly subscribers: DMelodyMediator[] = [];
  register(...subscribers: DMelodyMediator[]) {
    this.subscribers.push(...subscribers);
  }
}
