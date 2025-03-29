import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";

export interface I_IRPlotLayer
  extends
  AudioReflectable,
  WindowReflectable { }
