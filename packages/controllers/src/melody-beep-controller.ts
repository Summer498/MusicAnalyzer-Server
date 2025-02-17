import { MelodyBeepVolume } from "./slider";
import { MelodyBeepSwitcher } from "./switcher";

export const melodyBeepController = (
  melody_beep_switcher: MelodyBeepSwitcher,
  melody_beep_volume: MelodyBeepVolume,
) => {
  const melody_beep_controllers_div = document.createElement("div");
  melody_beep_controllers_div.appendChild(melody_beep_switcher.body,);
  melody_beep_controllers_div.appendChild(melody_beep_volume.body);
  melody_beep_controllers_div.id = "melody-beep-controllers";
  return melody_beep_controllers_div;
};
