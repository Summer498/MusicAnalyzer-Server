import { MelodyBeepSwitcher } from "./melody-beep-toggle";
import { MelodyBeepSwitcherSubscriber } from "./melody-beep-toggle";
import { MelodyBeepVolume } from "./melody-beep-volume";
import { MelodyBeepVolumeSubscriber } from "./melody-beep-volume";

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
  register(...subscribers: (
    MelodyBeepSwitcherSubscriber
    & MelodyBeepVolumeSubscriber
  )[]) {
    this.checkbox.register(...subscribers);
    this.volume.register(...subscribers)
  }
}