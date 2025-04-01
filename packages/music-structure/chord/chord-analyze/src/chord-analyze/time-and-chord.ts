import { Time } from "@music-analyzer/time-and";

export class TimeAndChordSymbol {
  constructor(
    readonly time: Time,
    readonly chord: string,
  ) {
  }
}