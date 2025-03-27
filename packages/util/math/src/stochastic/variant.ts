import { square } from "../basic-function/square";
import { squareSum } from "../reduction/square-sum";
import { average } from "./average";

export const variant = (array: number[]) => squareSum(array) / array.length - square(average(array));
