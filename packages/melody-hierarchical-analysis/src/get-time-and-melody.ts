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
  const ret = {
    ...melody_notes,
    head: {
      begin: matrix[element.measure][element.note].leftend,
      end: matrix[element.measure][element.note].rightend,
    },
  } as TimeAndMelody;
  return ret;
};
