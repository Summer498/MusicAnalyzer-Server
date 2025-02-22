import { analyzeMelody, TimeAndAnalyzedMelody, TimeAndMelody } from "@music-analyzer/melody-analyze";
import { ReductionElement, TimeSpan } from "@music-analyzer/gttm";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { getTimeAndMelody } from "./get-time-and-melody";
import { MusicXML } from "@music-analyzer/musicxml";

const scaleAndTranslate = (e: TimeAndMelody, w: number, b: number) => {
  return {
    begin: e.begin * w + b,
    end: e.end * w + b,
    head: {
      begin: e.head.begin * w + b,
      end: e.head.end * w + b,
    },
    note: e.note,
  } as TimeAndMelody;
};

const appendIR = (e: TimeAndAnalyzedMelody) => {
  return {
    ...e,
    IR: e.melody_analysis.implication_realization.symbol,
  } as TimeAndAnalyzedMelody & { IR: string };
};

export const getHierarchicalMelody = (
  measure: number,
  reduction: ReductionElement,
  matrix: TimeSpan[][],
  musicxml: MusicXML,
  roman: TimeAndRomanAnalysis[]
) => {
  return [...Array(reduction.getDepthCount())]
    .map((_, layer) => {
      return analyzeMelody(
        reduction.getArrayOfLayer(layer)
          .map(element => {
            const w = measure / 8;  // NOTE: 1 measure = 3.5
            const b = 0;
            const melody = getTimeAndMelody(element, matrix, musicxml);
            const scaled_melody = scaleAndTranslate(melody, w, b);
            return scaled_melody;
          }),
        roman)
        .map(e => appendIR(e));
    });
};
