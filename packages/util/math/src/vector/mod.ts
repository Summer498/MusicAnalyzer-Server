import { mod } from "../basic-function";
import { vFunc } from "./func";

export const vMod = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => mod(a, b));
