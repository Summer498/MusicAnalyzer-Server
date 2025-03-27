import { square } from "../src/basic-function/square";
import { squareSum } from "../src/reduction/square-sum";
import { average } from "./average";

export const variant = (array: number[]) => squareSum(array) / array.length - square(average(array));
