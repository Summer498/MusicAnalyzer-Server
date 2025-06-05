import { unique, getCapitalCase, assertNonNullable } from "./index";

describe("stdlib utilities", () => {
  test("unique removes duplicates", () => {
    expect(unique([1, 1, 2])).toEqual([1, 2]);
  });

  test("getCapitalCase capitalizes first letter", () => {
    expect(getCapitalCase("hello")).toBe("Hello");
  });

  test("assertNonNullable throws on null or undefined", () => {
    expect(() => assertNonNullable(null as any)).toThrow();
    expect(() => assertNonNullable(undefined as any)).toThrow();
    expect(assertNonNullable(0)).toBe(0);
  });
});
