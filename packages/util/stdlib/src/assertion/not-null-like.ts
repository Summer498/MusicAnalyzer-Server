import { assertNotNull } from "./not-null";
import { assertNotUndefined } from "./not-undefined";

export const assertNonNullable = <T>(value: T | null | undefined) => assertNotNull(assertNotUndefined(value));
