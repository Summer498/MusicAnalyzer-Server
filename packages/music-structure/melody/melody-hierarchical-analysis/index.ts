import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { analyzeMelody } from "@music-analyzer/melody-analyze";
import { TimeAndMelody } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ReductionElement } from "@music-analyzer/gttm";
import { TimeSpan } from "@music-analyzer/gttm";
import { MusicXML } from "@music-analyzer/musicxml";
import { Pitch } from "@music-analyzer/musicxml";
import { Time } from "@music-analyzer/time-and";
import { getChroma } from "@music-analyzer/tonal-objects";

const getTime = (
  matrix: TimeSpan[][],
  left: ReductionElement,
  right: ReductionElement,
) => new Time(
  matrix[left.measure][left.note].leftend,
  matrix[right.measure][right.note].rightend,
)

const calcChroma = (pitch: Pitch) => 12 + pitch.octave * 12 + (pitch.alter || 0) + getChroma(pitch.step);
export const getTimeAndMelody = (
  element: ReductionElement,
  matrix: TimeSpan[][],
  musicxml: MusicXML,
) => {
  const leftend = element.getLeftEnd();
  const rightend = element.getRightEnd();
  const note = musicxml["score-partwise"].part.measure.find(e => e.number === element.measure)!.note;
  const pitch = Array.isArray(note) ? note[element.note - 1].pitch : note.pitch;
  return new TimeAndMelody(
    getTime(matrix, leftend, rightend),
    getTime(matrix, element, element),
    pitch ? calcChroma(pitch) : NaN,
  );
};

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
  const head = e.head.map(e => e * w + b);
  return new TimeAndMelody(
    time,
    head,
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
