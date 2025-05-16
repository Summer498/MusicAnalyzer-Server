import { Checkbox } from "./switcher";
import { Slider } from "./slider";

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

export class MelodyBeepSwitcher
  extends Checkbox<boolean> {
  constructor(id: string, label: string) {
    super(id, label);
  }
  update() {
    const visibility = this.input.checked;
    this.listeners.forEach(e => e(visibility))
  };
};

export class MelodyBeepController {
  readonly view: HTMLDivElement;
  readonly checkbox: MelodyBeepSwitcher;
  readonly volume: MelodyBeepVolume;
  constructor() {
    const melody_beep_switcher = new MelodyBeepSwitcher("melody_beep_switcher", "Beep Melody");
    const melody_beep_volume = new MelodyBeepVolume();
    this.view = document.createElement("div");
    this.view.appendChild(melody_beep_switcher.body,);
    this.view.appendChild(melody_beep_volume.body);
    this.view.id = "melody-beep-controllers";
    this.checkbox = melody_beep_switcher;
    this.volume = melody_beep_volume;
  };
}