import * as Module from "./index";

describe("stdlib utilities", () => {
  test("should load module", () => {
    expect(Module).toBeTruthy();
  });
});
