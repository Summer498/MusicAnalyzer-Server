import { vAdd } from "./add";

export const vSum = (...arrays: number[][]) => arrays.reduce((p, c) => vAdd(p, c));
