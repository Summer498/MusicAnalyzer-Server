import { Dyad } from "@music-analyzer/irm";
import { Monad } from "@music-analyzer/irm";
import { Null_ad } from "@music-analyzer/irm";
import { Triad } from "@music-analyzer/irm";
import { SerializedGravity } from "./serialized-gravity";

type MelodyAnalysis_Args = [SerializedGravity | undefined, SerializedGravity | undefined, Triad | Dyad | Monad | Null_ad];
const getArgsOfMelodyAnalysis = (
  args
    : MelodyAnalysis_Args
    | [SerializedMelodyAnalysis]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [
      e.scale_gravity && new SerializedGravity(e.scale_gravity),
      e.chord_gravity && new SerializedGravity(e.chord_gravity),
      e.implication_realization
    ] as MelodyAnalysis_Args
  }
  return args;
}
export class SerializedMelodyAnalysis {
  readonly chord_gravity: SerializedGravity | undefined
  readonly scale_gravity: SerializedGravity | undefined
  readonly implication_realization: Triad | Dyad | Monad | Null_ad
  constructor(e: SerializedMelodyAnalysis);
  constructor(
    scale_gravity: SerializedGravity | undefined,
    chord_gravity: SerializedGravity | undefined,
    implication_realization: Triad | Dyad | Monad | Null_ad,
  );
  constructor(
    ...args
      : MelodyAnalysis_Args
      | [SerializedMelodyAnalysis]
  ) {
    const [scale_gravity, chord_gravity, implication_realization] = getArgsOfMelodyAnalysis(args)
    this.scale_gravity = scale_gravity;
    this.chord_gravity = chord_gravity;
    this.implication_realization = implication_realization;
  }
};
