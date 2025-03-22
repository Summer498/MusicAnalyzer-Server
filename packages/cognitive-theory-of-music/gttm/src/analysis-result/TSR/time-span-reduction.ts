import { ITimeSpanTree } from "./i-time-span";
import { TimeSpanTree } from "./time-span";

export interface ITimeSpanReduction {
  readonly tstree: ITimeSpanTree;
}

export class TimeSpanReduction 
  implements ITimeSpanReduction {
  readonly tstree: TimeSpanTree;
  constructor(tsr: ITimeSpanReduction) {
    this.tstree = new TimeSpanTree(tsr.tstree);
  }
}
