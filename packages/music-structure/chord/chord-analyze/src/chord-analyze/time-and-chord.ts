import { Time } from "@music-analyzer/time-and/src/time";

export class TimeAndChordSymbol {
  constructor(
    readonly time: Time,
    readonly chord: string,
  ) {
  }
}