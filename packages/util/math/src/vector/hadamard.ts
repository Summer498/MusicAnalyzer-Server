import { vFunc } from "./func";

export const hadamard = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => a * b);
