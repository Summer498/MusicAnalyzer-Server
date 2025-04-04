import { forAll } from "../logic";

export const isSubSet = <T>(set: T[], superset: T[]) => forAll(set, e => superset.includes(e));
