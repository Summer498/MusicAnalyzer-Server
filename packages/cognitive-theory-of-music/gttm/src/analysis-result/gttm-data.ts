import { GroupingStructure } from "./GRP";
import { MetricalStructure } from "./MTR";
import { IProlongationalReduction } from "./PR";
import { ITimeSpanReduction } from "./TSR";

export class GTTMData {
  constructor(
    readonly grouping?: GroupingStructure,
    readonly metric?: MetricalStructure,
    readonly time_span?: ITimeSpanReduction,
    readonly prolongation?: IProlongationalReduction,
  ) { }
}
