import fs from "fs";
import path from "path";

describe("post-pyin module", () => {
  test("should execute with temporary paths", () => {
    const tmpDir = fs.mkdtempSync(path.join(__dirname, "tmp-"));
    const jsonPath = path.join(__dirname, "out.json");
    const originalArgv = process.argv;
    process.argv = ["node", "index.ts", jsonPath, tmpDir];
    jest.resetModules();
    expect(() => require("./index")).not.toThrow();
    process.argv = originalArgv;
  });
});
