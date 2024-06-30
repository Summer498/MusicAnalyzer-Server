import { BeatPos, Path } from "./common";

interface D_Chord {
  duration: number,
  velocity: number,
  note: { id: BeatPos }
}

class Chord implements D_Chord {
  duration: number;
  velocity: number;
  note: { id: BeatPos };
  constructor(chord: D_Chord) {
    this.duration = chord.duration;
    this.velocity = chord.velocity;
    this.note = chord.note;
  }
  // TODO: get chroma
}

interface D_Temp {
  difference: number,
  stable: 0 | "unknown" | Path,
  pred: { temp: 0 | "-inf" | Path }
  succ: { temp: 0 | "+inf" | Path }
}

class Temp implements D_Temp {
  difference: number;
  stable: 0 | "unknown" | Path;
  pred: { temp: 0 | "-inf" | Path };
  succ: { temp: 0 | "+inf" | Path };
  constructor(temp: D_Temp) {
    this.difference = temp.difference;
    this.stable = temp.stable;
    this.pred = temp.pred;
    this.succ = temp.succ;
  }
}


interface D_TS {
  timespan: number,
  leftend: number,
  rightend: number,
  head: { chord: D_Chord },
  at: { temp: D_Temp },
  primary?: D_TS_Tree
  secondary?: D_TS_Tree
}

export class TS implements D_TS {
  timespan: number;
  leftend: number;
  rightend: number;
  head: { chord: Chord };
  at: { temp: Temp };
  primary?: TS_Tree;
  secondary?: TS_Tree;
  constructor(ts: D_TS) {
    this.timespan = ts.timespan;
    this.leftend = ts.leftend;
    this.rightend = ts.rightend;
    this.head = { chord: new Chord(ts.head.chord) };
    this.at = { temp: new Temp(ts.at.temp) };
    this.primary = ts.primary && new TS_Tree(ts.primary);
    this.secondary = ts.secondary && new TS_Tree(ts.secondary);
  }
  forEach(callback: (value: TS) => void) {
    callback(this);
    this.primary?.ts.forEach(callback);
    this.secondary?.ts.forEach(callback);
  }
  getHeadElement(): TS {
    return this.primary ? this.primary.ts.getHeadElement() : this;
  }
  getDepthCount(): number {
    // returns depth count (1 based)
    // this.getArrayOfLayer(this.getDepth()-1) すると this と同じ階層の配列が取れる
    const p_depth = this.primary?.ts.getDepthCount() || 0;
    const s_depth = this.secondary?.ts.getDepthCount() || 0;
    return 1 + Math.max(p_depth, s_depth);
  }
  private _getArrayOfLayer(i: number, layer?: number): (TS[] | undefined) {
    if (layer !== undefined && i >= layer) { return [this]; }  // stop search
    if (this.primary === undefined && this.secondary === undefined) { return [this]; }  // arrival at leaf

    const p_array = this.primary?.ts._getArrayOfLayer(i + 1, layer);
    const s_array = this.secondary?.ts._getArrayOfLayer(i + 1, layer);

    // marge arrays
    if (!p_array) { return s_array; }
    else if (!s_array) { return p_array; }
    else if (p_array[0].leftend < s_array[0].leftend) {
      return [...p_array, ...s_array];
    }
    else if (p_array[0].leftend >= s_array[0].leftend) {
      return [...s_array, ...p_array];
    }
    else {
      throw new Error(`Reached unexpected code point`);
    }
  }
  getArrayOfLayer(layer?: number): (TS[] | undefined) {
    return this._getArrayOfLayer(0, layer);
  }
}


interface D_TS_Tree {
  ts: D_TS
}

class TS_Tree implements D_TS_Tree {
  ts: TS;
  constructor(ts_tree: D_TS_Tree) {
    this.ts = new TS(ts_tree.ts);
  }
}

export interface D_TSR {
  tstree: D_TS_Tree;
}

export class TSR implements D_TSR {
  tstree: TS_Tree;
  constructor(tsr: D_TSR) {
    this.tstree = new TS_Tree(tsr.tstree);
  }
}