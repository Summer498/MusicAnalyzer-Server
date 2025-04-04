import { _throw } from "../error";

export const assertNotNaN = (value: number) => isNaN(value) ? _throw(new TypeError("NaN value received")) : value;
