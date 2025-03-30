import { AudioReflectable } from "@music-analyzer/view";
import { WindowReflectable } from "@music-analyzer/view";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

export interface IBeatBarsSeries
  extends
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable { }
