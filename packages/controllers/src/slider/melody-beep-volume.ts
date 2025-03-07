import { Slider } from "./abstract-slider";

export class MelodyBeepVolume extends Slider {
  constructor() {
    super("melody_beep_volume", "", 0, 100, 1);
  };
  override updateDisplay() {
    this.display.textContent = `volume: ${this.input.value}`;
  }
}
