import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { analyzeMelody } from "@music-analyzer/melody-analyze";
import { TimeAndMelody } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { getTimeAndMelody } from "./get-time-and-melody";
import { ReductionElement } from "@music-analyzer/gttm";
import { TimeSpan } from "@music-analyzer/gttm";
import { MusicXML } from "@music-analyzer/musicxml";

class SerializedTimeAndAnalyzedMelodyAndIR
  extends SerializedTimeAndAnalyzedMelody {
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
    readonly IR: string,
  ) {
    super(e.time, e.head, e.note, e.melody_analysis);
  }
}

const appendIR = (e: SerializedTimeAndAnalyzedMelody) => {
  return new SerializedTimeAndAnalyzedMelodyAndIR(
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

const getMapOntToHierarchicalMelodyFromLayer = (measure: number, reduction: ReductionElement, matrix: TimeSpan[][], musicxml: MusicXML, roman: SerializedTimeAndRomanAnalysis[]) => (_: unknown, layer: number) => {
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
  roman: SerializedTimeAndRomanAnalysis[]
) => {
  return [...Array(reduction.getDepthCount())]
    .map(getMapOntToHierarchicalMelodyFromLayer(measure, reduction, matrix, musicxml, roman));
};
