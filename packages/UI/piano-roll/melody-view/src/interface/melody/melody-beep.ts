import { MelodyBeepSwitcherSubscriber } from "@music-analyzer/controllers";
import { MelodyBeepVolumeSubscriber } from "@music-analyzer/controllers";

export interface IMelodyBeep
  extends
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber { }
