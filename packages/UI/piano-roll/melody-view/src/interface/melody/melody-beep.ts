import { MelodyBeepSwitcherSubscriber } from "@music-analyzer/controllers/src/melody-beep-controller/melody-beep-toggle/melody-beep-switcher-subscriber";
import { MelodyBeepVolumeSubscriber } from "@music-analyzer/controllers/src/melody-beep-controller/melody-beep-volume/melody-beep-volume-subscriber";

export interface IMelodyBeep
  extends
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber { }
