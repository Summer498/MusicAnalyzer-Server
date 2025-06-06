import * as Module from "./index";

function expectFn(name: string) {
  expect(typeof (Module as any)[name]).toBe("function");
}

describe("piano-roll melody-view", () => {
  test("should load module", () => {
    expect(Module).toBeTruthy();
  });
  test("should export factories", () => {
    [
      "buildDMelody",
      "buildIRPlot",
      "buildIRSymbol",
      "buildMelody",
      "buildReduction",
      "buildGravity",
      "buildIRGravity",
    ].forEach(expectFn);
  });
});
