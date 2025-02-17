import { Switcher } from "./abstract-switcher";

export class DMelodySwitcher extends Switcher {
  constructor(id: string, label: string) {
    super(id, label);
  }
}

export class DMelodyController {
  readonly view: HTMLDivElement;
  constructor(d_melody_switcher: DMelodySwitcher) {
    this.view = document.createElement("div");
    this.view.id = "d-melody";
    this.view.appendChild(d_melody_switcher.body);
  };
}
