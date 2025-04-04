import { Head } from "../../common";
import { ReductionElement } from "../../ReductionElement";
import { IAt } from "../interface";
import { Chord } from "./chord";
import { ITimeSpan } from "../interface";
import { ITimeSpanTree } from "../interface";
import { At } from "./at";


export class TimeSpanTree 
  implements ITimeSpanTree {
  readonly ts: TimeSpan;
  constructor(ts_tree: ITimeSpanTree) {
    this.ts = new TimeSpan(ts_tree.ts);
  }
}

export class TimeSpan 
  extends ReductionElement 
  implements ITimeSpan {
  readonly timespan: number;
  readonly leftend: number;
  readonly rightend: number;
  readonly head: Head<Chord>;
  readonly at: IAt;
  readonly primary?: TimeSpanTree;
  readonly secondary?: TimeSpanTree;
  constructor(ts: ITimeSpan) {
    const primary = ts.primary && new TimeSpanTree(ts.primary);
    const secondary = ts.secondary && new TimeSpanTree(ts.secondary);
    super(ts.head.chord.note.id, primary?.ts, secondary?.ts);
    this.timespan = ts.timespan;
    this.leftend = ts.leftend;
    this.rightend = ts.rightend;
    this.head = new Head(ts.head);
    this.at = new At(ts.at);
    this.primary = primary;
    this.secondary = secondary;
  }

  getMatrixOfLayer(layer?: number) {
    const array = this.getArrayOfLayer(layer) as TimeSpan[];
    const matrix: TimeSpan[][] = [[]];
    array?.forEach(e => {
      if (!matrix[e.measure]) { matrix[e.measure] = []; }
      matrix[e.measure][e.note] = e;
    });
    return matrix;
  }
}
