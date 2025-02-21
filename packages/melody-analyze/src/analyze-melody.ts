import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { IMelodyModel, MelodyAnalysis, TimeAndMelody } from "./interfaces";
import { _Chord, _Note, _Scale } from "@music-analyzer/tonal-objects";
import { Archetype } from "@music-analyzer/irm";
import { registerGravity } from "./register-gravity";

const getArchetype = (prev?: number, curr?: number, next?: number) => {
  const notes = [prev, curr, next].map(e => e ? _Note.fromMidi(e) : undefined);
  const archetype = new Archetype(notes[0], notes[1], notes[2]);
  return archetype;
};

export const analyzeMelody = (
  melodies: TimeAndMelody[],
  romans: TimeAndRomanAnalysis[],
): IMelodyModel[] => {
  //  const prev_prev = [undefined, undefined, ...melodies];
  const prev = [undefined, ...melodies];
  const curr = [...melodies];
  const next = [...melodies.slice(1), undefined];
  return curr.map((e, i) => {
    const roman = romans.find(roman => roman.begin <= e.end && e.begin < roman.end); // TODO: 治す. 現状はとりあえずコードとメロディを大きめに重ならせてみているだけ
    const time_and_melody = {
      ...e,
      roman_name: roman?.roman || "",
    } as TimeAndMelody;

    const melody_analysis = {
      scale_gravity: registerGravity(roman && _Scale.get(roman.scale), prev[i]?.note, curr[i]?.note),
      chord_gravity: registerGravity(roman && _Chord.get(roman.chord), prev[i]?.note, curr[i]?.note),
      implication_realization: getArchetype(prev[i]?.note, curr[i]?.note, next[i]?.note)
    } as MelodyAnalysis;

    return {
      ...time_and_melody,
      melody_analysis: melody_analysis,
    } as IMelodyModel;
  });
};
