import { UpdatableRegistry } from "@music-analyzer/view";
import { Controller } from "./controller";

export class HierarchyLevel implements Controller {
  readonly body: HTMLSpanElement;
  readonly range: HTMLInputElement;
  readonly #display: HTMLSpanElement;
  constructor() {
    this.range = document.createElement("input");
    this.range.type = "range";
    this.range.id = "hierarchy_level_slider";
    this.range.min = String(0);
    this.range.max = String(1);
    this.range.step = String(1);
    this.#display = document.createElement("span");
    this.#display.textContent = `layer: ${this.range.value}`;
    this.range.addEventListener("input", e => {
      this.#display.textContent = `layer: ${this.range.value}`;
      UpdatableRegistry.instance.onUpdate();
    });
    const label = document.createElement("label");
    label.textContent = "Melody Hierarchy Level";
    label.htmlFor = this.range.id;
    this.body = document.createElement("span");
    this.body.appendChild(label);
    this.body.appendChild(this.range);
    this.body.appendChild(this.#display);
  }
  setHierarchyLevelSliderValues = (max: number) => {
    console.log(`max: ${max}`);
    this.range.max = String(max);
    this.range.value = String(max);
    this.#display.textContent = `layer: ${this.range.value}`;
  };
};

