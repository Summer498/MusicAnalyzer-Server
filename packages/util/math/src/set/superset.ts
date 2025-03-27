import { isSubSet } from "./subset";

export const isSuperSet = <T>(set: T[], subset: T[]) => isSubSet(subset, set);
