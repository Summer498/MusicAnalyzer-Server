import { AudioReflectableRegistry } from "./facade";
import { WindowReflectableRegistry } from "./facade";
import { RequiredByIRPlotView } from "./required-by-ir-plot-view";

export interface RequiredByIRPlot
  extends RequiredByIRPlotView {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
}