import { assertNotNaN } from "../assertion/not-nan";

export const castToNumber = (value: string) => assertNotNaN(Number(value));
