import { Time } from "@music-analyzer/time-and/src/time";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";

export class TimeAndChord {
  constructor(
    readonly time: Time,
    readonly chord: Chord
  ) { }
}