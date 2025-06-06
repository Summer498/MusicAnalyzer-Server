import { ReductionElement } from "./ReductionElement";
import { Head, createHead } from "./common";
import { Note } from "./common";
import { Path } from "./common";


type Pred = { readonly temp: 0 | "-inf" | Path };
type Succ = { readonly temp: 0 | "+inf" | Path };

interface ITimeSpanTree {
  readonly ts: ITimeSpan
}

interface ITimeSpan {
  readonly timespan: number,
  readonly leftend: number,
  readonly rightend: number,
  readonly head: Head<IChord>,
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

export interface Temp extends ITemp {}
export const createTemp = (temp: ITemp): Temp => ({
  difference: temp.difference,
  stable: temp.stable,
  pred: temp.pred,
  succ: temp.succ,
});

export interface At { readonly temp: Temp }
export const createAt = (at: IAt): At => ({
  temp: createTemp(at.temp),
});

export interface Chord extends IChord {}
export const createChord = (chord: IChord): Chord => ({
  duration: chord.duration,
  velocity: chord.velocity,
  note: chord.note,
});

export interface TimeSpanTree extends ITimeSpanTree { ts: TimeSpan }
export const createTimeSpanTree = (ts_tree: ITimeSpanTree): TimeSpanTree => ({
  ts: createTimeSpan(ts_tree.ts),
});

export interface TimeSpan extends ReductionElement, ITimeSpan {
  readonly head: Head<Chord>;
  readonly at: At;
  readonly primary?: TimeSpanTree;
  readonly secondary?: TimeSpanTree;
  getMatrixOfLayer(layer?: number): TimeSpan[][];
}

export const createTimeSpan = (ts: ITimeSpan): TimeSpan => {
  const primary = ts.primary && createTimeSpanTree(ts.primary);
  const secondary = ts.secondary && createTimeSpanTree(ts.secondary);
  const base = createReductionElement(ts.head.chord.note.id, primary?.ts, secondary?.ts);
  const self: TimeSpan = {
    ...base,
    timespan: ts.timespan,
    leftend: ts.leftend,
    rightend: ts.rightend,
    head: createHead(ts.head),
    at: createAt(ts.at),
    primary,
    secondary,
    getMatrixOfLayer(layer?: number) {
      const array = self.getArrayOfLayer(layer) as TimeSpan[];
      const matrix: TimeSpan[][] = [[]];
      array?.forEach(e => {
        if (!matrix[e.measure]) { matrix[e.measure] = []; }
        matrix[e.measure][e.note] = e;
      });
      return matrix;
    },
  };
  return self;
};

export interface TimeSpanReduction extends ITimeSpanReduction { tstree: TimeSpanTree }
export const createTimeSpanReduction = (tsr: ITimeSpanReduction): TimeSpanReduction => ({
  tstree: createTimeSpanTree(tsr.tstree),
});
