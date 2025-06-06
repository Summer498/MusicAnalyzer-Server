import { Time } from "@music-analyzer/time-and";
import { Chord } from "@music-analyzer/tonal-objects";

export interface TimeAndChord {
  time: Time;
  chord: Chord;
}

export const createTimeAndChord = (
  time: Time,
  chord: Chord,
): TimeAndChord => ({ time, chord });
