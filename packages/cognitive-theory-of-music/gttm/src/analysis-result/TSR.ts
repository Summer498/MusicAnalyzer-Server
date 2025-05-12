import { ReductionElement } from "./ReductionElement";
import { Head } from "./common";
import { Note } from "./common";
import { Path } from "./common";
import { IHead } from "./common";


type Pred = { readonly temp: 0 | "-inf" | Path };
type Succ = { readonly temp: 0 | "+inf" | Path };

interface ITimeSpanTree {
  readonly ts: ITimeSpan
}

interface ITimeSpan {
  readonly timespan: number,
  readonly leftend: number,
  readonly rightend: number,
  readonly head: IHead<IChord>,
  readonly at: IAt,
  readonly primary?: ITimeSpanTree
  readonly secondary?: ITimeSpanTree
}

interface ITemp {
  readonly difference: number,
  readonly stable: 0 | "unknown" | Path,
  readonly pred: Pred
  readonly succ: Succ
}

interface IChord 
  extends Chord {
  readonly duration: number,
  readonly velocity: number,
}

type IAt = { readonly temp: ITemp }

export interface ITimeSpanReduction {
  readonly tstree: ITimeSpanTree;
}

class Temp 
  implements ITemp {
  readonly difference: number;
  readonly stable: 0 | "unknown" | Path;
  readonly pred: Pred;
  readonly succ: Succ;
  constructor(temp: ITemp) {
    this.difference = temp.difference;
    this.stable = temp.stable;
    this.pred = temp.pred;
    this.succ = temp.succ;
  }
}

class At {
  readonly temp: Temp
  constructor(
    at: IAt
  ) {
    this.temp = new Temp(at.temp)
  }
}

class Chord 
  implements IChord {
  readonly duration: number;
  readonly velocity: number;
  readonly note: Note;
  constructor(chord: IChord) {
    this.duration = chord.duration;
    this.velocity = chord.velocity;
    this.note = chord.note;
  }
  // TODO: get chroma
}

class TimeSpanTree 
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

export class TimeSpanReduction 
  implements ITimeSpanReduction {
  readonly tstree: TimeSpanTree;
  constructor(tsr: ITimeSpanReduction) {
    this.tstree = new TimeSpanTree(tsr.tstree);
  }
}
