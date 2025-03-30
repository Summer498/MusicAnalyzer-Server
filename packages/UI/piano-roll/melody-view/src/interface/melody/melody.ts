import { ColorChangeSubscriber } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { IMelodyBeep } from "./melody-beep";

export interface IMelody
  extends
  IMelodyBeep,
  ColorChangeSubscriber,
  TimeRangeSubscriber { }
