import { AudioReflectable } from "./facade";
import { WindowReflectable } from "./facade";
import { TimeRangeSubscriber } from "./facade";

export interface IChordPartSeries
  extends
  AudioReflectable,
  WindowReflectable,
  TimeRangeSubscriber { }
