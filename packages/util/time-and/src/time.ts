type Time_Args = [number, number]
const getArgs = (
  ...args
    : Time_Args
    | [Time]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.begin, e.end] as Time_Args;
  }
  else {
    return args
  }
}

export class Time {
  readonly begin: number
  readonly end: number
  get duration() { return this.end - this.begin }
  constructor(time: Time);
  constructor(begin: number, end: number);
  constructor(
    ...args
      : Time_Args
      | [Time]
  ) {
    const [begin, end] = getArgs(...args);
    this.begin = begin;
    this.end = end;
  }
  map(func: (e: number) => number) {
    return new Time(func(this.begin), func(this.end));
  }
  has(medium: number) {
    return this.begin <= medium && medium < this.end;
  }
}