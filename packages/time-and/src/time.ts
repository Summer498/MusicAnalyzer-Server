const getArgs = (
  ...args:
    [Time]
    | [number, number]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.begin, e.end];
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
    ...args:
      [Time]
      | [number, number]
  ) {
    const e = getArgs(...args);
    this.begin = e[0];
    this.end = e[1];
  }
  map(func: (e: number) => number) {
    return new Time(func(this.begin), func(this.end));
  }
}