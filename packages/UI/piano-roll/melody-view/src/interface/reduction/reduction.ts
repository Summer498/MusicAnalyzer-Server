import { WindowReflectable } from "@music-analyzer/view";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

export interface IReduction
  extends
  TimeRangeSubscriber,
  WindowReflectable { }
