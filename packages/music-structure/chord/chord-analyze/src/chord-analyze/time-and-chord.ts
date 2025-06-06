import { Time } from "@music-analyzer/time-and";

export interface TimeAndChordSymbol {
  time: Time;
  chord: string;
}

export const createTimeAndChordSymbol = (
  time: Time,
  chord: string,
): TimeAndChordSymbol => ({ time, chord });
