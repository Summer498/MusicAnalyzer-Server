import { GroupingStructure } from "./GRP";
import { MetricalStructure } from "./MTR";
import { IProlongationalReduction } from "./PR";
import { ITimeSpanReduction } from "./TSR";

export interface GTTMData {
  readonly grouping?: GroupingStructure;
  readonly metric?: MetricalStructure;
  readonly time_span?: ITimeSpanReduction;
  readonly prolongation?: IProlongationalReduction;
}

export const createGTTMData = (
  grouping?: GroupingStructure,
  metric?: MetricalStructure,
  time_span?: ITimeSpanReduction,
  prolongation?: IProlongationalReduction,
): GTTMData => ({
  grouping,
  metric,
  time_span,
  prolongation,
});
