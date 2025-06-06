import { Checkbox, createCheckbox } from "./switcher";
import { Slider, createSlider } from "./slider";

export interface MelodyBeepVolume extends Slider<number> {}

export const createMelodyBeepVolume = (): MelodyBeepVolume => {
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

export interface MelodyBeepSwitcher extends Checkbox {}

export const createMelodyBeepSwitcher = (
  id: string,
  label: string,
): MelodyBeepSwitcher => createCheckbox(id, label);

export interface MelodyBeepController {
  readonly view: HTMLDivElement;
  readonly checkbox: MelodyBeepSwitcher;
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
