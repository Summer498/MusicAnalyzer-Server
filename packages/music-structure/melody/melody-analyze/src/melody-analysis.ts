import { Dyad } from "@music-analyzer/irm/src/archetype/Dyad";
import { Monad } from "@music-analyzer/irm/src/archetype/Monad";
import { Null_ad } from "@music-analyzer/irm/src/archetype/Null-ad";
import { Triad } from "@music-analyzer/irm/src/archetype/triad/Triad";
import { Gravity } from "./gravity";

type MelodyAnalysis_Args = [Gravity | undefined, Gravity | undefined, Triad | Dyad | Monad | Null_ad];
const getArgsOfMelodyAnalysis = (
  args
    : MelodyAnalysis_Args
    | [MelodyAnalysis]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [
      e.scale_gravity && new Gravity(e.scale_gravity),
      e.chord_gravity && new Gravity(e.chord_gravity),
      e.implication_realization
    ] as MelodyAnalysis_Args
  }
  return args;
}
export class MelodyAnalysis {
  readonly chord_gravity: Gravity | undefined
  readonly scale_gravity: Gravity | undefined
  readonly implication_realization: Triad | Dyad | Monad | Null_ad
  constructor(e: MelodyAnalysis);
  constructor(
    scale_gravity: Gravity | undefined,
    chord_gravity: Gravity | undefined,
    implication_realization: Triad | Dyad | Monad | Null_ad,
  );
  constructor(
    ...args
      : MelodyAnalysis_Args
      | [MelodyAnalysis]
  ) {
    const [scale_gravity, chord_gravity, implication_realization] = getArgsOfMelodyAnalysis(args)
    this.scale_gravity = scale_gravity;
    this.chord_gravity = chord_gravity;
    this.implication_realization = implication_realization;
  }
};
