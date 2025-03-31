import { ColorChangeSubscriber } from "./facade";
import { TimeRangeSubscriber } from "./facade";
import { IMelodyBeep } from "./melody-beep";

export interface IMelody
  extends
  IMelodyBeep,
  ColorChangeSubscriber,
  TimeRangeSubscriber { }
