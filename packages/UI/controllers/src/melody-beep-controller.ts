import { Checkbox, createCheckbox } from "./switcher";
export interface MelodyBeepVolume extends Slider<number> {}

export function createMelodyBeepVolume(): MelodyBeepVolume {
  class Impl extends Slider<number> {
    constructor() {
      super("melody_beep_volume", "", 0, 100, 1);
    }
    override updateDisplay() {
      this.display.textContent = `volume: ${this.input.value}`;
    }
    update() {
      const value = Number(this.input.value);
      this.listeners.forEach(e => e(value));
    }
  return new Impl();
export interface MelodyBeepSwitcher extends Checkbox {}

export function createMelodyBeepSwitcher(id: string, label: string): MelodyBeepSwitcher {
  class Impl extends Checkbox {
    constructor(id: string, label: string) {
      super(id, label);
    }
    update() {
      const visibility = this.input.checked;
      this.listeners.forEach(e => e(visibility));
    }
  return new Impl(id, label);
}
export interface MelodyBeepController {
  readonly checkbox: Checkbox;
}

export function createMelodyBeepController(): MelodyBeepController {
  const melody_beep_switcher = createMelodyBeepSwitcher("melody_beep_switcher", "Beep Melody");
  const melody_beep_volume = createMelodyBeepVolume();
  const view = document.createElement("div");
  view.appendChild(melody_beep_switcher.body);
  view.appendChild(melody_beep_volume.body);
  view.id = "melody-beep-controllers";
  return {
    view,
    checkbox: melody_beep_switcher,
    volume: melody_beep_volume,
  const melody_beep_switcher = createMelodyBeepSwitcher(
    "melody_beep_switcher",
    "Beep Melody",
  );
  const melody_beep_volume = createMelodyBeepVolume();
  const view = document.createElement("div");
  view.appendChild(melody_beep_switcher.body);
  view.appendChild(melody_beep_volume.body);
  view.id = "melody-beep-controllers";
  return {
    view,
    checkbox: melody_beep_switcher,
    volume: melody_beep_volume,
  };
};
