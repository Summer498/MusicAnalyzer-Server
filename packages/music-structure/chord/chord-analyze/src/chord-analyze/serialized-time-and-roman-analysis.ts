import { Time, createTime } from "@music-analyzer/time-and";

export interface SerializedTimeAndRomanAnalysis {
  time: Time;
  chord: string;
  scale: string;
  roman: string;
}

export const createSerializedTimeAndRomanAnalysis = (
  time: Time,
  chord: string,
  scale: string,
  roman: string,
): SerializedTimeAndRomanAnalysis => ({
  time: createTime(time),
  chord,
  scale,
  roman,
});

export const cloneSerializedTimeAndRomanAnalysis = (e: SerializedTimeAndRomanAnalysis) =>
  createSerializedTimeAndRomanAnalysis(e.time, e.chord, e.scale, e.roman);

const v = "25.03.10.08.51" as string;
export interface SerializedRomanAnalysisData {
  version: string;
  body: SerializedTimeAndRomanAnalysis[];
}

export const createSerializedRomanAnalysisData = (
  body: SerializedTimeAndRomanAnalysis[],
): SerializedRomanAnalysisData => ({ version: v, body });

export const checkVersion = (e: { version: string }) => e.version === v;

export const instantiateSerializedRomanAnalysisData = (e: { body: SerializedTimeAndRomanAnalysis[] }) =>
  createSerializedRomanAnalysisData(e.body.map(cloneSerializedTimeAndRomanAnalysis));
