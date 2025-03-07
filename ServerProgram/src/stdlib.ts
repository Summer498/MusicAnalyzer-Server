export const _throw = <E extends Error>(e: E) => { throw e; };  // 文の式化
export const assertNotNull = <T>(value: T | null, error = new TypeError("null value received")) => value !== null ? value : _throw(error);
export const assertNotUndefined = <T>(value: T | undefined, error = new TypeError("undefined value received")) => value !== undefined ? value : _throw(error);
export const assertNonNullable = <T>(value: T | null | undefined) => assertNotNull(assertNotUndefined(value));
