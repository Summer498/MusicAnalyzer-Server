import { hasSameValue } from "@music-analyzer/stdlib/src/deep-equal";

export const sameArray = <T>(arr1: T[], arr2: T[]) => hasSameValue(arr1, arr2);
