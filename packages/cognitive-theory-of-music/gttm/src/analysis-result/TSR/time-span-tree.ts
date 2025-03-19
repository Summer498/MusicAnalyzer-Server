import { ITimeSpan, TimeSpan } from "./time-span";

export interface ITimeSpanTree {
  readonly ts: ITimeSpan
}

export class TimeSpanTree 
  implements ITimeSpanTree {
  readonly ts: TimeSpan;
  constructor(ts_tree: ITimeSpanTree) {
    this.ts = new TimeSpan(ts_tree.ts);
  }
}
