describe("getFreqFromPhase", () => {
  const { getFreqFromPhase } = require("./src/get-freq-from-phase");
  test("returns cumulative phase starting with zero", () => {
    const input = [1, 2, 3];
    const result = getFreqFromPhase(input);
    expect(result).toEqual([0, 1, 3]);
  });
  test("handles empty array", () => {
    expect(getFreqFromPhase([])).toEqual([]);
  });
});
