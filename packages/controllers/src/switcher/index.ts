import { Controller } from "../controller";

export class Switcher implements Controller {
  readonly body: HTMLSpanElement;
  readonly checkbox: HTMLInputElement;
  readonly label: HTMLLabelElement;
  constructor(id: string, label: string) {
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.checked = false;
    this.checkbox.id = id;
    this.checkbox.name = id;
    this.label = document.createElement("label");
    this.label.textContent = label;
    this.label.htmlFor = this.checkbox.id;
    this.body = document.createElement("span");
    this.body.appendChild(this.label);
    this.body.appendChild(this.checkbox);
  }
}