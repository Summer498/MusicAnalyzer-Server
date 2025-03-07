import { ReductionElement, TimeSpan } from "@music-analyzer/gttm";
import { getTimeAndMelodyFromTS } from "./get-time-and-melody-from-TS";
import { TimeAndMelody } from "@music-analyzer/melody-analyze";
import { MusicXML } from "@music-analyzer/musicxml";
import { Time } from "@music-analyzer/time-and";

export const getTimeAndMelody = (
  element: ReductionElement,
  matrix: TimeSpan[][],
  musicxml: MusicXML,
) => {
  const melody_notes = getTimeAndMelodyFromTS(element, matrix, musicxml);
  return new TimeAndMelody(
    melody_notes.begin,
    melody_notes.end,
    melody_notes.note,
    new Time(
      matrix[element.measure][element.note].leftend,
      matrix[element.measure][element.note].rightend,
    )
  );
};
