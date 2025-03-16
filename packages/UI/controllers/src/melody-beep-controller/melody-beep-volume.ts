import { MelodyVolumeMediator } from "@music-analyzer/music-analyzer-application";
import { Slider } from "../slider";

export class MelodyBeepVolume extends Slider {
  constructor() {
    super("melody_beep_volume", "", 0, 100, 1);
  };
  override updateDisplay() {
    this.display.textContent = `volume: ${this.input.value}`;
  }
  readonly subscribers: MelodyVolumeMediator[] = [];
  register(...subscribers: MelodyVolumeMediator[]) {
    this.subscribers.push(...subscribers);
  }
}
