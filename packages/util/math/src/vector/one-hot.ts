import { indicator } from "../basic-function/indicator";

export const getOnehot = (positionOfOnes: number[], n = 0) => [...Array(Math.max(Math.max(...positionOfOnes) + 1, n))].map((_, i) => indicator(positionOfOnes.includes(i)),);
