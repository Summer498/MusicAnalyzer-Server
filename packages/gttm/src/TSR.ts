import { BeatPos, Path } from "./common";
import { ReductionElement } from "./ReductionElement";

interface D_Chord {
  readonly duration: number,
  readonly velocity: number,
  readonly note: {
    readonly id: BeatPos
  }
}

class Chord implements D_Chord {
  readonly duration: number;
  readonly velocity: number;
  readonly note: { readonly id: BeatPos };
  constructor(chord: D_Chord) {
    this.duration = chord.duration;
    this.velocity = chord.velocity;
    this.note = chord.note;
  }
  // TODO: get chroma
}

interface D_Temp {
  readonly difference: number,
  readonly stable: 0 | "unknown" | Path,
  readonly pred: { readonly temp: 0 | "-inf" | Path }
  readonly succ: { readonly temp: 0 | "+inf" | Path }
}

class Temp implements D_Temp {
  readonly difference: number;
  readonly stable: 0 | "unknown" | Path;
  readonly pred: { readonly temp: 0 | "-inf" | Path };
  readonly succ: { readonly temp: 0 | "+inf" | Path };
  constructor(temp: D_Temp) {
    this.difference = temp.difference;
    this.stable = temp.stable;
    this.pred = temp.pred;
    this.succ = temp.succ;
  }
}


interface D_TS {
  readonly timespan: number,
  readonly leftend: number,
  readonly rightend: number,
  readonly head: { readonly chord: D_Chord },
  readonly at: { readonly temp: D_Temp },
  readonly primary?: D_TS_Tree
  readonly secondary?: D_TS_Tree
}

export class TS extends ReductionElement implements D_TS {
  readonly timespan: number;
  readonly leftend: number;
  readonly rightend: number;
  readonly head: { readonly chord: Chord };
  readonly at: { readonly temp: Temp };
  readonly primary?: TS_Tree;
  readonly secondary?: TS_Tree;
  constructor(ts: D_TS) {
    const primary = ts.primary && new TS_Tree(ts.primary);
    const secondary = ts.secondary && new TS_Tree(ts.secondary);
    super(ts.head.chord.note.id, primary?.ts, secondary?.ts);
    this.timespan = ts.timespan;
    this.leftend = ts.leftend;
    this.rightend = ts.rightend;
    this.head = { chord: new Chord(ts.head.chord) };
    this.at = { temp: new Temp(ts.at.temp) };
    this.primary = primary;
    this.secondary = secondary;
  }

  getMatrixOfLayer(layer?: number): TS[][] {
    const array = this.getArrayOfLayer(layer) as TS[];
    const matrix: TS[][] = [[]];
    array?.forEach(e => {
      if (!matrix[e.measure]) { matrix[e.measure] = []; }
      matrix[e.measure][e.note] = e;
    });
    return matrix;
  }
}


interface D_TS_Tree {
  readonly ts: D_TS
}

class TS_Tree implements D_TS_Tree {
  readonly ts: TS;
  constructor(ts_tree: D_TS_Tree) {
    this.ts = new TS(ts_tree.ts);
  }
}

export interface D_TSR {
  readonly tstree: D_TS_Tree;
}

export class TSR implements D_TSR {
  readonly tstree: TS_Tree;
  constructor(tsr: D_TSR) {
    this.tstree = new TS_Tree(tsr.tstree);
  }
}