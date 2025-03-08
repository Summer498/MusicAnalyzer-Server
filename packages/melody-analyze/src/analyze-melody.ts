import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { _Chord, _Note, _Scale } from "@music-analyzer/tonal-objects";
import { Archetype } from "@music-analyzer/irm";
import { TimeAndAnalyzedMelody, MelodyAnalysis, TimeAndMelody } from "./interfaces";
import { registerGravity } from "./register-gravity";

const getArchetype = (prev?: number, curr?: number, next?: number) => {
  const notes = [prev, curr, next].map(e => e ? _Note.fromMidi(e) : undefined);
  const archetype = new Archetype(notes[0], notes[1], notes[2]);
  return archetype;
};

export const analyzeMelody = (
  melodies: TimeAndMelody[],
  romans: TimeAndRomanAnalysis[],
) => {
  //  const prev_prev = [undefined, undefined, ...melodies];
  const prev = [undefined, ...melodies];
  const curr = [...melodies];
  const next = [...melodies.slice(1), undefined];
  return curr.map((e, i) => {
    const roman = romans.find(roman => roman.time.begin <= e.end && e.begin < roman.time.end); // TODO: 治す. 現状はとりあえずコードとメロディを大きめに重ならせてみているだけ
    const time_and_melody = new TimeAndMelody(
      e.begin,
      e.end,
      e.note,
      e.head,
    );

    const melody_analysis = new MelodyAnalysis(
      registerGravity(roman && _Scale.get(roman.scale), prev[i]?.note, curr[i]?.note),
      registerGravity(roman && _Chord.get(roman.chord), prev[i]?.note, curr[i]?.note),
      getArchetype(prev[i]?.note, curr[i]?.note, next[i]?.note)
    );

    return new TimeAndAnalyzedMelody(
      time_and_melody.begin,
      time_and_melody.end,
      time_and_melody.note,
      time_and_melody.head,
      melody_analysis,
    );
  }).filter(e => isNaN(0 * e.note) === false);
};
