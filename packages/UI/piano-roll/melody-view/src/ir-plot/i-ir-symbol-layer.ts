import { WindowReflectable } from "@music-analyzer/view";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

export interface I_IRSymbolLayer
  extends
  TimeRangeSubscriber,
  WindowReflectable { }
