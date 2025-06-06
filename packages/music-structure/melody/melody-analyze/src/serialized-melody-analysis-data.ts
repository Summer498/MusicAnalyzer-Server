import { SerializedTimeAndAnalyzedMelody, cloneSerializedTimeAndAnalyzedMelody } from "./serialized-time-and-analyzed-melody";

const v = "25.03.10.08.51";

export interface SerializedMelodyAnalysisData {
  version: string;
  body: SerializedTimeAndAnalyzedMelody[];
}

export const createSerializedMelodyAnalysisData = (
  body: SerializedTimeAndAnalyzedMelody[],
): SerializedMelodyAnalysisData => ({ version: v, body });

export const checkVersion = (e: { version: string }) => e.version === v;

export const instantiateSerializedMelodyAnalysisData = (
  e: { body: SerializedTimeAndAnalyzedMelody[] },
) => createSerializedMelodyAnalysisData(e.body.map(cloneSerializedTimeAndAnalyzedMelody));
