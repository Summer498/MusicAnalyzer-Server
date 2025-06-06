import { Time, createTime } from "@music-analyzer/time-and";
import { SerializedMelodyAnalysis, cloneSerializedMelodyAnalysis } from "./serialized-melody-analysis";

export interface SerializedTimeAndAnalyzedMelody {
  time: Time;
  head: Time;
  note: number;
  melody_analysis: SerializedMelodyAnalysis;
}

export const createSerializedTimeAndAnalyzedMelody = (
  time: Time,
  head: Time,
  note: number,
  melody_analysis: SerializedMelodyAnalysis,
): SerializedTimeAndAnalyzedMelody => ({
  time: createTime(time),
  head: createTime(head),
  note,
  melody_analysis: cloneSerializedMelodyAnalysis(melody_analysis),
});

export const cloneSerializedTimeAndAnalyzedMelody = (
  e: SerializedTimeAndAnalyzedMelody,
) =>
  createSerializedTimeAndAnalyzedMelody(
    e.time,
    e.head,
    e.note,
    e.melody_analysis,
  );
