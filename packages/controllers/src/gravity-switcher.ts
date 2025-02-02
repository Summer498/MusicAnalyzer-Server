import { UpdatableRegistry } from "@music-analyzer/view";
import { Controller } from "./controller";

export class GravitySwitcher implements Controller {
  readonly body: HTMLSpanElement;
  readonly checkbox: HTMLInputElement;
  readonly #gravities: SVGElement[];
  constructor(id: string, label: string, gravities: SVGElement[]) {
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.id = id;
    this.checkbox.name = id;
    this.checkbox.checked = true;
    this.#gravities = gravities;
    this.checkbox.addEventListener("change", e => {
      this.#gravities.forEach(gravity => gravity.style.visibility = this.checkbox.checked ? "visible" : "hidden");
      UpdatableRegistry.instance.onUpdate();
    });
    const label_element = document.createElement("label");
    label_element.textContent = label;
    label_element.htmlFor = this.checkbox.id;
    this.body = document.createElement("span");
    this.body.appendChild(label_element);
    this.body.appendChild(this.checkbox);
  };
}

