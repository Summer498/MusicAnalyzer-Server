type Time_Args = [number, number]

const getArgs = (
  ...args: Time_Args | [Time]
) => {
  if (args.length === 1) {
    const [e] = args
    return [e.begin, e.end] as Time_Args
  }
  return args
}

export interface Time {
  readonly begin: number
  readonly end: number
  readonly duration: number
  map(func: (e: number) => number): Time
  has(medium: number): boolean
}

export const createTime = (
  ...args: Time_Args | [Time]
): Time => {
  const [begin, end] = getArgs(...args)
  return {
    begin,
    end,
    get duration() { return this.end - this.begin },
    map: (func: (e: number) => number) => createTime(func(begin), func(end)),
    has: (medium: number) => begin <= medium && medium < end,
  }
}