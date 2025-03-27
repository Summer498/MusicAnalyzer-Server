import { totalSum } from "../reduction/sum";

export const average = (array: number[]) => totalSum(array) / array.length;
