import { Chord } from "@music-analyzer/tonal-objects";
import { Scale } from "@music-analyzer/tonal-objects";
import { convertToTrueTonic } from "./convert-to-true-tonic";
import { get_roman } from "./get-roman";



export class RomanChord {
  readonly roman: string;
  readonly chord: Chord;
  constructor(
    readonly scale: Scale,
    chord: Chord,
  ) {
    this.chord = convertToTrueTonic(chord, this.scale);
    this.roman = get_roman(this.chord, this.scale);
  }
}
