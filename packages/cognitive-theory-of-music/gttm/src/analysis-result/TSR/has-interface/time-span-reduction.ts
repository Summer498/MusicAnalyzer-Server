import { ITimeSpanReduction } from "../interface";
import { TimeSpanTree } from "./time-span";

export class TimeSpanReduction 
  implements ITimeSpanReduction {
  readonly tstree: TimeSpanTree;
  constructor(tsr: ITimeSpanReduction) {
    this.tstree = new TimeSpanTree(tsr.tstree);
  }
}
