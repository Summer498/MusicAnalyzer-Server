import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";

export interface IReduction
  extends
  TimeRangeSubscriber,
  WindowReflectable { }
