import { decimal, mod, argmax } from "./index";

describe("math utilities", () => {
  test("decimal extracts fractional part", () => {
    expect(decimal(1.3)).toBeCloseTo(0.3);
    expect(decimal(-0.75)).toBeCloseTo(0.25);
  });

  test("mod handles negatives", () => {
    expect(mod(5, 3)).toBe(2);
    expect(mod(-1, 3)).toBe(2);
  });

  test("argmax finds largest element index", () => {
    expect(argmax([1, 3, 2])).toBe(1);
  });
});
