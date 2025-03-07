import { Controller } from "../controller";

export abstract class Slider extends Controller {
  readonly display: HTMLSpanElement;
  constructor(id: string, label: string, min: number, max: number, step: number, value?: number) {
    super ("range", id, label);
    this.display = document.createElement("span");
    this.body.appendChild(this.display);

    this.input.min = String(min);
    this.input.max = String(max);
    this.input.step = String(step);
    value && (this.input.value = String(value));

    this.updateDisplay();
    this.input.addEventListener("input", this.updateDisplay.bind(this));
  }
  abstract updateDisplay(): void;
}