import { RequiredByHierarchy } from "../abstract/required-by-abstract-hierarchy";
import { RequiredByLayer } from "../abstract/required-by-abstract-layer";
import { RequiredByView } from "../abstract/required-by-abstract-view";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";

interface RequiredByIRPlotView
  extends RequiredByView { }

export interface RequiredByIRPlot
  extends RequiredByIRPlotView {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
}
interface RequiredByIRPlotLayer
  extends
  RequiredByIRPlot,
  RequiredByLayer { }

export interface RequiredByIRPlotHierarchy
  extends
  RequiredByIRPlotLayer,
  RequiredByHierarchy { }

export interface RequiredByIRPlotSVG
  extends RequiredByIRPlotHierarchy { }
