import { Controller } from "./controller";

export class MelodyBeepSwitcher implements Controller {
  readonly body: HTMLSpanElement;
  readonly checkbox: HTMLInputElement;
  constructor() {
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.id = "melody_beep_switcher";
    this.checkbox.name = "melody_beep_switcher";
    this.checkbox.checked = false;
    const label = document.createElement("label");
    label.textContent = "Beep Melody";
    label.htmlFor = this.checkbox.id;
    this.body = document.createElement("span");
    this.body.appendChild(label);
    this.body.appendChild(this.checkbox);
  }
};

