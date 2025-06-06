import fs from "fs";
import path from "path";

describe("post-crepe module", () => {
  test("should execute with temporary paths", () => {
    const tmpDir = fs.mkdtempSync(path.join(__dirname, "tmp-"));
    const csvPath = path.join(__dirname, "vocals.csv");
    const originalArgv = process.argv;
    process.argv = ["node", "index.ts", csvPath, tmpDir];
    jest.resetModules();
    expect(() => require("./index")).not.toThrow();
    process.argv = originalArgv;
  });
});
