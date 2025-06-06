import { Checkbox } from "./switcher";
import { Slider, createSlider } from "./slider";

export interface MelodyBeepVolume extends Slider<number> {}

const createMelodyBeepVolume = (): MelodyBeepVolume => {
  const updateDisplay = (s: Slider<number>) => {
    s.display.textContent = `volume: ${s.input.value}`;
  };
  const updateFn = (s: Slider<number>, ls: ((e: number) => void)[]) => {
    const value = Number(s.input.value);
    ls.forEach(e => e(value));
  };
  return createSlider<number>(
    "melody_beep_volume",
    "",
    0,
    100,
    1,
    undefined,
    updateFn,
    updateDisplay,
  );
};

class MelodyBeepSwitcher
  extends Checkbox {
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
    const melody_beep_volume = createMelodyBeepVolume();
    this.view = document.createElement("div");
    this.view.appendChild(melody_beep_switcher.body,);
    this.view.appendChild(melody_beep_volume.body);
    this.view.id = "melody-beep-controllers";
    this.checkbox = melody_beep_switcher;
    this.volume = melody_beep_volume;
  };
}