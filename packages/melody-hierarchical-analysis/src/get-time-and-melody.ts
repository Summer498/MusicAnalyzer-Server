import { ReductionElement, TimeSpan } from "@music-analyzer/gttm";
import { getTimeAndMelodyFromTS } from "./get-time-and-melody-from-TS";
import { TimeAndMelody } from "@music-analyzer/melody-analyze";
import { MusicXML } from "@music-analyzer/musicxml";

export const getTimeAndMelody = (
  element: ReductionElement,
  matrix: TimeSpan[][],
  musicxml: MusicXML,
) => {
  const melody_notes = getTimeAndMelodyFromTS(element, matrix, musicxml);
  const ret = new TimeAndMelody(
    melody_notes.begin,
    melody_notes.end,
    melody_notes.note,
    {
      begin: matrix[element.measure][element.note].leftend,
      end: matrix[element.measure][element.note].rightend,
    },
  );
  return ret;
};
