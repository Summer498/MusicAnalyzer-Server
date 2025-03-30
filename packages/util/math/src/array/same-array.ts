import { hasSameValue } from "@music-analyzer/stdlib";

export const sameArray = <T>(arr1: T[], arr2: T[]) => hasSameValue(arr1, arr2);
