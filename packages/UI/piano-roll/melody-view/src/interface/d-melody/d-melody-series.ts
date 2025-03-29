import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { DMelodyControllerSubscriber } from "@music-analyzer/controllers/src/switcher/d-melody/d-melody-controller-subscriber";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";

export interface IDMelodySeries
  extends
  AudioReflectable,
  DMelodyControllerSubscriber,
  TimeRangeSubscriber,
  WindowReflectable { }
