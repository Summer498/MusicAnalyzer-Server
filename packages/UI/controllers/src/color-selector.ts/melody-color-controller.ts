import { MelodyColorSelector } from "./melody-color-selector";

export class MelodyColorController {
  readonly view: HTMLDivElement;
  readonly selector: MelodyColorSelector;
  constructor() {
    this.selector = new MelodyColorSelector();
    this.view = document.createElement("div");
    this.view.id = "melody-color-selector";
    this.view.style.display = "inline";
    this.view.appendChild(this.selector.body);
  }
  readonly subscribers: never[] = [];
  register(...subscribers: never[]) {
    this.subscribers.push(...subscribers);
  }
}
