import { AudioReflectable } from "./facade";
import { WindowReflectable } from "./facade";
import { TimeRangeSubscriber } from "./facade";

export interface IGravityLayer
  extends
  TimeRangeSubscriber,
  AudioReflectable,
  WindowReflectable { }
