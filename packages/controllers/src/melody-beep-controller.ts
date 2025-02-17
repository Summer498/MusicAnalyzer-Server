import { MelodyBeepVolume } from "./slider";
import { MelodyBeepSwitcher } from "./switcher";

export class MelodyBeepController {
  readonly view: HTMLDivElement;
  constructor(
    melody_beep_switcher: MelodyBeepSwitcher,
    melody_beep_volume: MelodyBeepVolume,
  ) {
    this.view = document.createElement("div");
    this.view.appendChild(melody_beep_switcher.body,);
    this.view.appendChild(melody_beep_volume.body);
    this.view.id = "melody-beep-controllers";
  };
}