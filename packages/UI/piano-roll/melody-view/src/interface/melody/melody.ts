import { ColorChangeSubscriber } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/color-change-subscriber";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { IMelodyBeep } from "./melody-beep";

export interface IMelody
  extends
  IMelodyBeep,
  ColorChangeSubscriber,
  TimeRangeSubscriber { }
