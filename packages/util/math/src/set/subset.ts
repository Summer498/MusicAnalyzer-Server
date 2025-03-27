import { forAll } from "../logic/first-order-logic/for-all";

export const isSubSet = <T>(set: T[], superset: T[]) => forAll(set, e => superset.includes(e));
