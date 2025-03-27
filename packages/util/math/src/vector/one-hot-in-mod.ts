import { vMod } from "./mod";
import { getOnehot } from "./one-hot";

export const getOnehotInMod = (positionOfOnes: number[] | number, m = 1) => {
  if (typeof positionOfOnes === "number") { return getOnehot(vMod([positionOfOnes], m), m); }
  return getOnehot(vMod(positionOfOnes, m), m);
};
