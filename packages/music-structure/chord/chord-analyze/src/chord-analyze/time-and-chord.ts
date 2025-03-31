import { Time } from "./facade";

export class TimeAndChordSymbol {
  constructor(
    readonly time: Time,
    readonly chord: string,
  ) {
  }
}