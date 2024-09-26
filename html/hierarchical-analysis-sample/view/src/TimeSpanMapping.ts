import { MusicXML, Pitch, } from "@music-analyzer/gttm/src/MusicXML";
import { getChroma } from "@music-analyzer/tonal-objects";
import { TimeAndMelody } from "@music-analyzer/melody-analyze";
import { TS } from "@music-analyzer/gttm/src/TSR";

const calcChroma = (pitch: Pitch) => 12 + pitch.octave * 12 + (pitch.alter || 0) + getChroma(pitch.step);
export const getTimeAndMelodyFromTS = (ts: TS, musicxml: MusicXML): TimeAndMelody => {
  const regexp = /P1-([0-9]+)-([0-9]+)/;
  const match = ts.head.chord.note.id.match(regexp);
  if (match) {
    const id_measure = Number(match[1]);
    const id_note = Number(match[2]);
    const note = musicxml["score-partwise"].part.measure[id_measure - 1].note;
    const pitch = Array.isArray(note) ? note[id_note - 1].pitch : note.pitch;
    return { note: calcChroma(pitch), begin: ts.leftend, end: ts.rightend, head: { begin: ts.leftend, end: ts.rightend } };
  }
  else {
    throw new SyntaxError(`Unexpected id received.\nExpected id is: ${regexp}`);
  }
};
