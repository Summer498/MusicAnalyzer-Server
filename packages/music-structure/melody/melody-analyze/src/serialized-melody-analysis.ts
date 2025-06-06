import { IDyad, IMonad, INull_ad, ITriad } from "@music-analyzer/irm";
import { SerializedGravity, cloneSerializedGravity } from "./serialized-gravity";

export interface SerializedMelodyAnalysis {
  chord_gravity: SerializedGravity | undefined;
  scale_gravity: SerializedGravity | undefined;
  implication_realization: ITriad | IDyad | IMonad | INull_ad;
}

export const createSerializedMelodyAnalysis = (
  scale_gravity: SerializedGravity | undefined,
  chord_gravity: SerializedGravity | undefined,
  implication_realization: ITriad | IDyad | IMonad | INull_ad,
): SerializedMelodyAnalysis => ({
  scale_gravity: scale_gravity && cloneSerializedGravity(scale_gravity),
  chord_gravity: chord_gravity && cloneSerializedGravity(chord_gravity),
  implication_realization,
});

export const cloneSerializedMelodyAnalysis = (e: SerializedMelodyAnalysis) =>
  createSerializedMelodyAnalysis(e.scale_gravity, e.chord_gravity, e.implication_realization);
