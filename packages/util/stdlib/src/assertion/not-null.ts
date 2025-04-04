import { _throw } from "../error";

export const assertNotNull = <T>(value: T | null, error = new TypeError("null value received")) => value !== null ? value : _throw(error);
