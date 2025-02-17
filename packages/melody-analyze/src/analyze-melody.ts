import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { IMelodyModel, TimeAndMelody } from "./interfaces";
import { _Chord, _Note, _Scale } from "@music-analyzer/tonal-objects";
import { Archetype } from "@music-analyzer/irm";
import { registerGravity } from "./register-gravity";

export const analyzeMelody = (
  melodies: TimeAndMelody[],
  romans: TimeAndRomanAnalysis[],
): IMelodyModel[] => {
  return melodies.map((melody, i) => {
    const _roman = romans.find(roman => roman.begin <= melody.end && melody.begin < roman.end); // TODO: 治す. 現状はとりあえずコードとメロディを大きめに重ならせてみているだけ
    const start = i > 1 ? i - 1 : 0;
    const next = i + 1;
    return {
      begin: melody.begin,
      end: melody.end,
      note: melody.note,
      head: melody.head,
      roman_name: _roman?.roman || "",
      melody_analysis: {
        scale_gravity: registerGravity(
          _roman?.scale || "",
          _Note.get(_Scale.get(_roman?.scale || "").tonic || "").chroma,
          melodies,
          i
        ),
        chord_gravity: registerGravity(
          _roman?.chord || "",
          _Note.get(_Chord.get(_roman?.chord || "").tonic || "").chroma,
          melodies,
          i
        ),
        implication_realization: new Archetype(melodies.slice(start, next + 1).map(e => !e.note ? undefined : _Note.fromMidi(e.note)))
      },
    };
  });
};
