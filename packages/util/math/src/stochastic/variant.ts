import { square } from "../basic-function";
import { squareSum } from "../reduction";
import { average } from "./average";

export const variant = (array: number[]) => squareSum(array) / array.length - square(average(array));
