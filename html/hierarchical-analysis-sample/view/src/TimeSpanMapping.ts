import { MusicXML, Pitch, } from "@music-analyzer/gttm";
import { getChroma } from "@music-analyzer/tonal-objects";
import { TimeAndMelody } from "@music-analyzer/melody-analyze";
import { TS } from "@music-analyzer/gttm";
import { ReductionElement } from "@music-analyzer/gttm";

const calcChroma = (pitch: Pitch) => 12 + pitch.octave * 12 + (pitch.alter || 0) + getChroma(pitch.step);
export const getTimeAndMelodyFromTS = (element: ReductionElement, duration_data: TS[][], musicxml: MusicXML): TimeAndMelody => {
  const leftend = element.getLeftEnd();
  const rightend = element.getRightEnd();
  const note = musicxml["score-partwise"].part.measure.find(e=>e.number===element.measure)!.note;
  const pitch = Array.isArray(note) ? note[element.note - 1].pitch : note.pitch;
  return {
    note: pitch ? calcChroma(pitch) : undefined,
    begin: duration_data[leftend.measure][leftend.note].leftend,
    end: duration_data[rightend.measure][rightend.note].rightend,
    head: {
      begin: duration_data[element.measure][element.note].leftend,
      end: duration_data[element.measure][element.note].rightend
    }
  };
};
