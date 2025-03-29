import { AudioReflectable } from "../facade/view";
import { WindowReflectable } from "../facade/view";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";

export interface IChordPartSeries
  extends
  AudioReflectable,
  WindowReflectable,
  TimeRangeSubscriber { }
