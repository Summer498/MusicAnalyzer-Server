import { Time } from "./facade";
import { Chord } from "./facade";

export class TimeAndChord {
  constructor(
    readonly time: Time,
    readonly chord: Chord
  ) { }
}