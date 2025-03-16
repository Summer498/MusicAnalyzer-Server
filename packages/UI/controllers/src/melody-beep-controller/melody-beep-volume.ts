import { Slider } from "../slider";

export interface MelodyBeepVolumeSubscriber {
  onMelodyVolumeBarChanged: (value: number) => void
}

export class MelodyBeepVolume extends Slider<MelodyBeepVolumeSubscriber> {
  constructor() {
    super("melody_beep_volume", "", 0, 100, 1);
  };
  override updateDisplay() {
    this.display.textContent = `volume: ${this.input.value}`;
  }
  update() {
    const value = Number(this.input.value);
    this.subscribers.forEach(e => e.onMelodyVolumeBarChanged(value));
  }
}
