import { _throw } from "../error/throw-function";

export const assertNotUndefined = <T>(value: T | undefined, error = new TypeError("undefined value received")) => value !== undefined ? value : _throw(error);
