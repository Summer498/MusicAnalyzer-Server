import { ReductionElement, TimeSpan, } from "@music-analyzer/gttm";
import { TimeAndMelody } from "@music-analyzer/melody-analyze";
import { MusicXML, Pitch } from "@music-analyzer/musicxml";
import { getChroma } from "@music-analyzer/tonal-objects";

const calcChroma = (pitch: Pitch) => 12 + pitch.octave * 12 + (pitch.alter || 0) + getChroma(pitch.step);
export const getTimeAndMelodyFromTS = (
  element: ReductionElement,
  matrix: TimeSpan[][],
  musicxml: MusicXML
) => {
  const leftend = element.getLeftEnd();
  const rightend = element.getRightEnd();
  const note = musicxml["score-partwise"].part.measure.find(e => e.number === element.measure)!.note;
  const pitch = Array.isArray(note) ? note[element.note - 1].pitch : note.pitch;
  return new TimeAndMelody(
    matrix[leftend.measure][leftend.note].leftend,
    matrix[rightend.measure][rightend.note].rightend,
    pitch ? calcChroma(pitch) : NaN,
    {
      begin: matrix[element.measure][element.note].leftend,
      end: matrix[element.measure][element.note].rightend
    }
  ) as TimeAndMelody;
};
