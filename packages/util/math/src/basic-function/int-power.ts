import { square } from "./square";

export const intPow = (b: number, p: number): number => p ? square(intPow(b, p >> 1)) * (p & 1 ? b : 1) : 1;
