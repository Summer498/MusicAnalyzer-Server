import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { _Chord, _Note, _Scale } from "@music-analyzer/tonal-objects";
import { Null_ad, Dyad, Monad, Triad } from "@music-analyzer/irm";
import { TimeAndAnalyzedMelody, MelodyAnalysis, TimeAndMelody } from "./interfaces";
import { registerGravity } from "./register-gravity";

const getSome_ad = (prev?: number, curr?: number, next?: number) => {
  const [p, c, n] = [prev, curr, next].map(e => e ? _Note.fromMidi(e) : undefined);
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
  romans: TimeAndRomanAnalysis[],
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
      registerGravity(roman && _Scale.get(roman.scale), prev[i]?.note, curr[i]?.note),
      registerGravity(roman && _Chord.get(roman.chord), prev[i]?.note, curr[i]?.note),
      getSome_ad(prev[i]?.note, curr[i]?.note, next[i]?.note)
    );

    return new TimeAndAnalyzedMelody(
      time_and_melody.time,
      time_and_melody.head,
      time_and_melody.note,
      melody_analysis,
    );
  }).filter(e => isNaN(0 * e.note) === false);
};
