import { totalSum } from "../src/reduction/sum";

export const average = (array: number[]) => totalSum(array) / array.length;
