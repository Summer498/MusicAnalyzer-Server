import { assertNotNaN } from "../assertion";

export const castToNumber = (value: string) => assertNotNaN(Number(value));
