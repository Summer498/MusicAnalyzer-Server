import { _throw } from "../error";

export const assertNotUndefined = <T>(value: T | undefined, error = new TypeError("undefined value received")) => value !== undefined ? value : _throw(error);
