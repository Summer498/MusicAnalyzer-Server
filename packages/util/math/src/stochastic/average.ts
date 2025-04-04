import { totalSum } from "../reduction";

export const average = (array: number[]) => totalSum(array) / array.length;
