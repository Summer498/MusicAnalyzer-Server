import { Time } from "@music-analyzer/time-and";
import { Chord } from "@music-analyzer/tonal-objects";

export class TimeAndChord {
  constructor(
    readonly time: Time,
    readonly chord: Chord
  ) { }
}