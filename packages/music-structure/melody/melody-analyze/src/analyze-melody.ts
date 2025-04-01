import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { getChord } from "@music-analyzer/tonal-objects";
import { noteFromMidi } from "@music-analyzer/tonal-objects";
import { getScale } from "@music-analyzer/tonal-objects";
import { SerializedTimeAndAnalyzedMelody } from "./time-and-analyzed-melody";
import { MelodyAnalysis } from "./melody-analysis";
import { TimeAndMelody } from "./time-and-melody";
import { registerGravity } from "./register-gravity";
import { Dyad } from "@music-analyzer/irm";
import { Monad } from "@music-analyzer/irm";
import { Null_ad } from "@music-analyzer/irm";
import { Triad } from "@music-analyzer/irm";

const getSome_ad = (prev?: number, curr?: number, next?: number) => {
  const [p, c, n] = [prev, curr, next].map(e => e ? noteFromMidi(e) : undefined);
  if (c !== undefined) {
    if (p !== undefined) {
      if (n !== undefined) { return new Triad(p, c, n) }
      else { return new Dyad(p, c); }
    }
    else if (n !== undefined) { return new Dyad(c, n) }
    else { return new Monad(c) }
  }
  else if (p !== undefined) { return new Monad(p); }
  else if (n !== undefined) { return new Monad(n); }
  else { return new Null_ad(); }
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
    const time_and_melody = new TimeAndMelody(
      e.time,
      e.head,
      e.note,
    );

    const melody_analysis = new MelodyAnalysis(
      registerGravity(roman && getScale(roman.scale), prev[i]?.note, curr[i]?.note),
      registerGravity(roman && getChord(roman.chord), prev[i]?.note, curr[i]?.note),
      getSome_ad(prev[i]?.note, curr[i]?.note, next[i]?.note)
    );

    return new SerializedTimeAndAnalyzedMelody(
      time_and_melody.time,
      time_and_melody.head,
      time_and_melody.note,
      melody_analysis,
    );
  }).filter(e => isNaN(0 * e.note) === false);
};
