import { Chord, Scale } from "@music-analyzer/tonal-objects";
import { convertToTrueTonic } from "./convert-to-true-tonic";
import { get_roman } from "./get-roman";

export interface RomanChord {
  roman: string;
  chord: Chord;
  scale: Scale;
}

export const createRomanChord = (scale: Scale, chord: Chord): RomanChord => {
  const trueChord = convertToTrueTonic(chord, scale);
  return {
    scale,
    chord: trueChord,
    roman: get_roman(trueChord, scale),
  };
};
