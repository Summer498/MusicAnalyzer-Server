import { AudioReflectable } from "./facade/view";
import { WindowReflectable } from "./facade/view";
import { TimeRangeSubscriber } from "./facade/controllers";

export interface IChordPartSeries
  extends
  AudioReflectable,
  WindowReflectable,
  TimeRangeSubscriber { }
