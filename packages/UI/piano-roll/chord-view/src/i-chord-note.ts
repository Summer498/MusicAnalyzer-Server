import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";

export interface IChordNote
  extends
  AudioReflectable,
  TimeRangeSubscriber { }
