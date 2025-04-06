import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { RequiredByIRPlotView } from "../r-view";

export interface RequiredByIRPlot
  extends RequiredByIRPlotView {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
}