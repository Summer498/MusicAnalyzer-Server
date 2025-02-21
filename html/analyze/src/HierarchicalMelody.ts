import { analyzeMelody, IMelodyModel, TimeAndMelody } from "@music-analyzer/melody-analyze";
import { MusicXML, ReductionElement, TimeSpan } from "@music-analyzer/gttm";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { getTimeAndMelodyFromTS } from "./TimeSpanMapping";

const getTimeAndMelody = (
  reduction_element: ReductionElement,
  matrix: TimeSpan[][],
  musicxml: MusicXML,
) => {
  const melody_notes = getTimeAndMelodyFromTS(reduction_element, matrix, musicxml);
  const ret = {
    ...melody_notes,
    head: {
      begin: matrix[reduction_element.measure][reduction_element.note].leftend,
      end: matrix[reduction_element.measure][reduction_element.note].rightend,
    },
  } as TimeAndMelody;
  return ret;
};

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

const appendIR = (e: IMelodyModel) => {
  return {
    ...e,
    IR: e.melody_analysis.implication_realization.symbol,
  } as IMelodyModel & { IR: string };
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
