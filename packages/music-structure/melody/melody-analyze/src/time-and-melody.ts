import { Time, createTime } from "@music-analyzer/time-and";

export interface TimeAndMelody {
  time: Time;
  head: Time;
  note: number;
}

export const createTimeAndMelody = (
  time: Time,
  head: Time,
  note: number,
): TimeAndMelody => ({
  time: createTime(time),
  head: createTime(head),
  note,
});

export const cloneTimeAndMelody = (e: TimeAndMelody) =>
  createTimeAndMelody(e.time, e.head, e.note);
