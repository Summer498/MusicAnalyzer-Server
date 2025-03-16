import { Slider } from "../slider";

interface MelodyBeepVolumeSubscriber {
  onMelodyVolumeBarChanged: (value: number) => void
}

export class MelodyBeepVolume extends Slider {
  constructor() {
    super("melody_beep_volume", "", 0, 100, 1);
    this.init()
  };
  override updateDisplay() {
    this.display.textContent = `volume: ${this.input.value}`;
  }
  readonly subscribers: MelodyBeepVolumeSubscriber[] = [];
  register(...subscribers: MelodyBeepVolumeSubscriber[]) {
    this.subscribers.push(...subscribers);
    this.update()
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
