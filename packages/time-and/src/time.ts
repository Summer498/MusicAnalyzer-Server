
export class Time {
  constructor(
    readonly begin: number,
    readonly end: number,
  ) { }
  map(func: (e: number) => number) {
    return new Time(func(this.begin), func(this.end));
  }
}