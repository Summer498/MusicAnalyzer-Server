import { analyzeMelody } from "@music-analyzer/melody-analyze/src/analyze-melody";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { TimeAndMelody } from "@music-analyzer/melody-analyze/src/time-and-melody";
import { ReductionElement } from "@music-analyzer/gttm/src/analysis-result/ReductionElement";
import { TimeSpan } from "@music-analyzer/gttm/src/analysis-result/TSR/has-interface/time-span";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { getTimeAndMelody } from "./get-time-and-melody";
import { MusicXML } from "@music-analyzer/musicxml/src/music-xml";

class TimeAndAnalyzedMelodyAndIR
  extends TimeAndAnalyzedMelody {
  constructor(
    e: TimeAndAnalyzedMelody,
    readonly IR: string,
  ) {
    super(e.time, e.head, e.note, e.melody_analysis);
  }
}

const appendIR = (e: TimeAndAnalyzedMelody) => {
  return new TimeAndAnalyzedMelodyAndIR(
    e,
    e.melody_analysis.implication_realization.symbol,
  );
};

const analyzeAndScaleMelody = (measure: number, matrix: TimeSpan[][], musicxml: MusicXML) => (element: ReductionElement) => {
  const w = measure / 8;  // NOTE: 1 measure = 3.5
  const b = 0;
  const e = getTimeAndMelody(element, matrix, musicxml);

  const time = e.time.map(e => e * w + b);
  return new TimeAndMelody(
    time,
    time,
    e.note,
  );
};

const getMapOntToHierarchicalMelodyFromLayer = (measure: number, reduction: ReductionElement, matrix: TimeSpan[][], musicxml: MusicXML, roman: TimeAndRomanAnalysis[]) => (_: unknown, layer: number) => {
  const melodies = reduction.getArrayOfLayer(layer)
    .map(analyzeAndScaleMelody(measure, matrix, musicxml));
  return analyzeMelody(melodies, roman)
    .map(e => appendIR(e));
};

export const getHierarchicalMelody = (
  measure: number,
  reduction: ReductionElement,
  matrix: TimeSpan[][],
  musicxml: MusicXML,
  roman: TimeAndRomanAnalysis[]
) => {
  return [...Array(reduction.getDepthCount())]
    .map(getMapOntToHierarchicalMelodyFromLayer(measure, reduction, matrix, musicxml, roman));
};
