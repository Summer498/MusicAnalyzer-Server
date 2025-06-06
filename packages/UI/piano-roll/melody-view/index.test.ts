import { JSDOM } from "jsdom";

function expectFn(name: string) {
  expect(typeof (Module as any)[name]).toBe("function");
}

describe("piano-roll melody-view", () => {
  let dom: JSDOM;
  beforeAll(() => {
    dom = new JSDOM("<!DOCTYPE html><svg></svg>");
    (global as any).window = dom.window as unknown as Window;
    (global as any).document = dom.window.document;
  });

  test("createMelodyElements returns element object", () => {
    const { createMelodyElements } = require("./index");
    const { createTime } = require("@music-analyzer/time-and");

    const controllers = {
      gravity: { addListeners: jest.fn() },
      audio: { addListeners: jest.fn() },
      d_melody: { addListeners: jest.fn() },
      window: { addListeners: jest.fn() },
      time_range: { addListeners: jest.fn() },
      implication: { addListeners: jest.fn() },
      melody_beep: { addListeners: jest.fn() },
      melody_color: { addListeners: jest.fn() },
      hierarchy: { addListeners: jest.fn() },
    };

    const melody = {
      time: createTime(0, 1),
      head: createTime(0, 0.5),
      note: 60,
      melody_analysis: {},
    };

    const result = createMelodyElements([[melody]], [melody], controllers);
    expect(result.children.length).toBeGreaterThan(0);
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
