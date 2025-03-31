import { MelodyBeepSwitcherSubscriber } from "./facade";
import { MelodyBeepVolumeSubscriber } from "./facade";

export interface IMelodyBeep
  extends
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber { }
