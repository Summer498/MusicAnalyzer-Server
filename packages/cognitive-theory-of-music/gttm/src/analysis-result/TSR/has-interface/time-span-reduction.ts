import { ITimeSpanReduction } from "../interface/i-time-span-reduction";
import { TimeSpanTree } from "./time-span";

export class TimeSpanReduction 
  implements ITimeSpanReduction {
  readonly tstree: TimeSpanTree;
  constructor(tsr: ITimeSpanReduction) {
    this.tstree = new TimeSpanTree(tsr.tstree);
  }
}
