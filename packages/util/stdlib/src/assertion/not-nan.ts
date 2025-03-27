import { _throw } from "../error/throw-function";

export const assertNotNaN = (value: number) => isNaN(value) ? _throw(new TypeError("NaN value received")) : value;
