import { AudioReflectable } from "@music-analyzer/view";
import { WindowReflectable } from "@music-analyzer/view";
import { DMelodyControllerSubscriber } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

export interface IDMelodySeries
  extends
  AudioReflectable,
  DMelodyControllerSubscriber,
  TimeRangeSubscriber,
  WindowReflectable { }
