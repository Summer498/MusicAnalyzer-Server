type Gravity_Args = [number, true | undefined];
const getArgsOfGravity = (
  args
    : Gravity_Args
    | [SerializedGravity]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.destination, e.resolved] as Gravity_Args;
  }
  return args;
}
export class SerializedGravity {
  readonly destination: number
  readonly resolved: true | undefined
  constructor(e: SerializedGravity);
  constructor(
    destination: number,
    resolved: true | undefined,
  );
  constructor(
    ...args
      : Gravity_Args
      | [SerializedGravity]
  ) {
    const [destination, resolved] = getArgsOfGravity(args);
    this.destination = destination;
    this.resolved = resolved;
  }
}