import { Head } from "../common";
import { ReductionElement } from "../ReductionElement";
import { At } from "./at";
import { Chord, IChord } from "./Chord";
import { Temp } from "./temp";
import { ITimeSpanTree, TimeSpanTree } from "./time-span-tree";

export interface ITimeSpan {
  readonly timespan: number,
  readonly leftend: number,
  readonly rightend: number,
  readonly head: Head<IChord>,
  readonly at: At,
  readonly primary?: ITimeSpanTree
  readonly secondary?: ITimeSpanTree
}

export class TimeSpan 
extends ReductionElement 
  implements ITimeSpan {
  readonly timespan: number;
  readonly leftend: number;
  readonly rightend: number;
  readonly head: Head<IChord>;
  readonly at: At;
  readonly primary?: TimeSpanTree;
  readonly secondary?: TimeSpanTree;
  constructor(ts: ITimeSpan) {
    const primary = ts.primary && new TimeSpanTree(ts.primary);
    const secondary = ts.secondary && new TimeSpanTree(ts.secondary);
    super(ts.head.chord.note.id, primary?.ts, secondary?.ts);
    this.timespan = ts.timespan;
    this.leftend = ts.leftend;
    this.rightend = ts.rightend;
    this.head = { chord: new Chord(ts.head.chord) };
    this.at = { temp: new Temp(ts.at.temp) };
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
