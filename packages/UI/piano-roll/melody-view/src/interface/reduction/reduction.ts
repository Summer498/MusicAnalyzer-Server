import { WindowReflectable } from "./facade";
import { TimeRangeSubscriber } from "./facade";

export interface IReduction
  extends
  TimeRangeSubscriber,
  WindowReflectable { }
