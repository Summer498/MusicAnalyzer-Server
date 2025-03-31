import { AudioReflectable } from "./facade";
import { WindowReflectable } from "./facade";
import { DMelodyControllerSubscriber } from "./facade";
import { TimeRangeSubscriber } from "./facade";

export interface IDMelodySeries
  extends
  AudioReflectable,
  DMelodyControllerSubscriber,
  TimeRangeSubscriber,
  WindowReflectable { }
