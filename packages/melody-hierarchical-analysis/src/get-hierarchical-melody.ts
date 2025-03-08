import { analyzeMelody, TimeAndAnalyzedMelody, TimeAndMelody } from "@music-analyzer/melody-analyze";
import { ReductionElement, TimeSpan } from "@music-analyzer/gttm";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { getTimeAndMelody } from "./get-time-and-melody";
import { MusicXML } from "@music-analyzer/musicxml";

const scaleAndTranslate = (e: TimeAndMelody, w: number, b: number) => {
  const time = e.time.map(e => e * w + b);
  return new TimeAndMelody(
    time,
    time,
    e.note,
  );
};

class TimeAndAnalyzedMelodyAndIR
  extends TimeAndAnalyzedMelody {
  constructor(
    e: TimeAndAnalyzedMelody,
    readonly IR: string,
  ) {
    super(e.begin, e.end, e.time, e.head, e.note, e.melody_analysis);
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
  const melody = getTimeAndMelody(element, matrix, musicxml);
  const scaled_melody = scaleAndTranslate(melody, w, b);
  return scaled_melody;
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
