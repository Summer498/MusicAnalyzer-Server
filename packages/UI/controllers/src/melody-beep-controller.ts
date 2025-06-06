import { Checkbox, createCheckbox } from "./switcher";
import { Slider, createSlider } from "./slider";

export type MelodyBeepVolume = Slider<number>;

export const createMelodyBeepVolume = (): MelodyBeepVolume =>
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

export type MelodyBeepSwitcher = Checkbox;

export const createMelodyBeepSwitcher = (
  id: string,
  label: string,
): MelodyBeepSwitcher => createCheckbox(id, label);

export interface MelodyBeepController {
  readonly view: HTMLDivElement;
  readonly checkbox: Checkbox;
  readonly volume: MelodyBeepVolume;
}

export const createMelodyBeepController = (): MelodyBeepController => {
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
