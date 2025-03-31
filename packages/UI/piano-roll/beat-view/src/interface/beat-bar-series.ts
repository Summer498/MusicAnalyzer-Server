import { AudioReflectable } from "./facade";
import { WindowReflectable } from "./facade";
import { TimeRangeSubscriber } from "./facade";

export interface IBeatBarsSeries
  extends
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable { }
