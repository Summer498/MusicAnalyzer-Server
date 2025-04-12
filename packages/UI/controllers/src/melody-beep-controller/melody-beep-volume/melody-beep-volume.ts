import { Slider } from "../../slider";

export class MelodyBeepVolume
  extends Slider<number> {
  constructor() {
    super("melody_beep_volume", "", 0, 100, 1);
  };
  override updateDisplay() {
    this.display.textContent = `volume: ${this.input.value}`;
  }
  update() {
    const value = Number(this.input.value);
    this.listeners.forEach(e => e(value));
  }
}
