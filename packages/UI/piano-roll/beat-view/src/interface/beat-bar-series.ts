import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { AudioReflectable } from "@music-analyzer/view";
import { WindowReflectable } from "@music-analyzer/view";

export interface IBeatBarsSeries
  extends
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable { }
