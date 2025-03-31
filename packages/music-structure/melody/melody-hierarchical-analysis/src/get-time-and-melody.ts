import { ReductionElement } from "./facade";
import { TimeSpan } from "./facade";
import { TimeAndMelody } from "./facade";
import { MusicXML } from "./facade";
import { Pitch } from "./facade";
import { Time } from "./facade";
import { getChroma } from "./facade";

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
