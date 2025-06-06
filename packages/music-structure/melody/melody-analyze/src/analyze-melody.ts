import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { getChord } from "@music-analyzer/tonal-objects";
import { noteFromMidi } from "@music-analyzer/tonal-objects";
import { getScale } from "@music-analyzer/tonal-objects";
import { createSerializedTimeAndAnalyzedMelody } from "./serialized-time-and-analyzed-melody";
import { createSerializedMelodyAnalysis } from "./serialized-melody-analysis";
import { createTimeAndMelody } from "./time-and-melody";
import { registerGravity } from "./register-gravity";
import { getDyad, getMonad, getNull_ad, getTriad } from "@music-analyzer/irm";

const getSome_ad = (prev?: number, curr?: number, next?: number) => {
  const [p, c, n] = [prev, curr, next].map(e => e ? noteFromMidi(e) : undefined);
  if (c !== undefined) {
    if (p !== undefined) {
      if (n !== undefined) { return getTriad(p, c, n) }
      else { return getDyad(p, c); }
    }
    else if (n !== undefined) { return getDyad(c, n) }
    else { return getMonad(c) }
  }
  else if (p !== undefined) { return getMonad(p); }
  else if (n !== undefined) { return getMonad(n); }
  else { return getNull_ad(); }
}

export const analyzeMelody = (
  melodies: TimeAndMelody[],
  romans: SerializedTimeAndRomanAnalysis[],
) => {
  //  const prev_prev = [undefined, undefined, ...melodies];
  const prev = [undefined, ...melodies];
  const curr = [...melodies];
  const next = [...melodies.slice(1), undefined];
  return curr.map((e, i) => {
    const roman = romans.find(roman => roman.time.begin <= e.time.end && e.time.begin < roman.time.end); // TODO: 治す. 現状はとりあえずコードとメロディを大きめに重ならせてみているだけ
    const time_and_melody = createTimeAndMelody(
      e.time,
      e.head,
      e.note,
    );

    const melody_analysis = createSerializedMelodyAnalysis(
      registerGravity(roman && getScale(roman.scale), prev[i]?.note, curr[i]?.note),
      registerGravity(roman && getChord(roman.chord), prev[i]?.note, curr[i]?.note),
      getSome_ad(prev[i]?.note, curr[i]?.note, next[i]?.note)
    );

    return createSerializedTimeAndAnalyzedMelody(
      time_and_melody.time,
      time_and_melody.head,
      time_and_melody.note,
      melody_analysis,
    );
  }).filter(e => isNaN(0 * e.note) === false);
};
