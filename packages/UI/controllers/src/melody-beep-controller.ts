import { Checkbox } from "./switcher";
import { Slider, createSlider } from "./slider";

const createMelodyBeepVolume = (): Slider<number> =>
  createSlider<number>({
    id: "melody_beep_volume",
    label: "",
    min: 0,
    max: 100,
    step: 1,
    updateDisplay: (input, display) => {
      display.textContent = `volume: ${input.value}`;
    },
    getValue: input => Number(input.value),
  });

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
  readonly volume: Slider<number>;
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