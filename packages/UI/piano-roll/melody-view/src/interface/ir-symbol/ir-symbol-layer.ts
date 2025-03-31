import { WindowReflectable } from "./facade";
import { TimeRangeSubscriber } from "./facade";

export interface I_IRSymbolLayer
  extends
  TimeRangeSubscriber,
  WindowReflectable { }
