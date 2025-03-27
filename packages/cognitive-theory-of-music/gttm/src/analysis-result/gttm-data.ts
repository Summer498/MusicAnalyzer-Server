import { GroupingStructure } from "./GRP/grouping-structure";
import { MetricalStructure } from "./MTR/metric-structure";
import { IProlongationalReduction } from "./PR/interface/i-prolongation-reduction";
import { ITimeSpanReduction } from "./TSR/interface/i-time-span-reduction";

export class GTTMData {
  constructor(
    readonly grouping?: GroupingStructure,
    readonly metric?: MetricalStructure,
    readonly time_span?: ITimeSpanReduction,
    readonly prolongation?: IProlongationalReduction,
  ) { }
}
