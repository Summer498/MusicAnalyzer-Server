import { Slider } from "../slider";
import { MelodyVM } from "@music-analyzer/melody-view/src/melody/melody-view-model";

export class MelodyBeepVolume extends Slider {
  constructor() {
    super("melody_beep_volume", "", 0, 100, 1);
  };
  override updateDisplay() {
    this.display.textContent = `volume: ${this.input.value}`;
  }
  readonly subscribers: MelodyVM[] = [];
  register(...subscribers: MelodyVM[]) {
    this.subscribers.push(...subscribers);
  }
  update() {
    const value = Number(this.input.value);
    this.subscribers.forEach(e => e.onMelodyVolumeBarChanged(value));
  }
  init() {
    this.input.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}
