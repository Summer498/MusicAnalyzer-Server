type Gravity_Args = [number, true | undefined];
const getArgsOfGravity = (
  args
    : Gravity_Args
    | [Gravity]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.destination, e.resolved] as Gravity_Args;
  }
  return args;
}
export class Gravity {
  readonly destination: number
  readonly resolved: true | undefined
  constructor(e: Gravity);
  constructor(
    destination: number,
    resolved: true | undefined,
  );
  constructor(
    ...args
      : Gravity_Args
      | [Gravity]
  ) {
    const [destination, resolved] = getArgsOfGravity(args);
    this.destination = destination;
    this.resolved = resolved;
  }
}