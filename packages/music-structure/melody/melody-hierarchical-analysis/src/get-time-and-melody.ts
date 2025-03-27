import { ReductionElement } from "@music-analyzer/gttm";
import { TimeSpan } from "@music-analyzer/gttm";
import { TimeAndMelody } from "@music-analyzer/melody-analyze/src/time-and-melody";
import { MusicXML } from "@music-analyzer/musicxml";
import { Pitch } from "@music-analyzer/musicxml";
import { Time } from "@music-analyzer/time-and";
import { getChroma } from "@music-analyzer/tonal-objects/src/note/chroma";

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
