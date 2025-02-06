import { Controller } from "./controller";

export class GravitySwitcher implements Controller {
  readonly body: HTMLSpanElement;
  readonly checkbox: HTMLInputElement;
  constructor(id: string, label: string) {
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.id = id;
    this.checkbox.name = id;
    this.checkbox.checked = true;
    const label_element = document.createElement("label");
    label_element.textContent = label;
    label_element.htmlFor = this.checkbox.id;
    this.body = document.createElement("span");
    this.body.appendChild(label_element);
    this.body.appendChild(this.checkbox);
  };
}
