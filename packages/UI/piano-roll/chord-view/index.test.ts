import { JSDOM } from "jsdom";

describe("piano-roll chord-view", () => {
  let dom: JSDOM;
  beforeAll(() => {
    dom = new JSDOM("<!DOCTYPE html><svg></svg>");
    (global as any).window = dom.window as unknown as Window;
    (global as any).document = dom.window.document;
  });

  test("ChordElements can be constructed", () => {
    const { ChordElements } = require("./index");
    const { createSerializedTimeAndRomanAnalysis } = require("@music-analyzer/chord-analyze");
    const { createTime } = require("@music-analyzer/time-and");

    const controllers = {
      audio: { addListeners: jest.fn() },
      window: { addListeners: jest.fn() },
      time_range: { addListeners: jest.fn() },
    };

    const romans = [
      createSerializedTimeAndRomanAnalysis(createTime(0, 1), "C", "C", "I"),
    ];

    const chord = new ChordElements(romans, controllers);
    expect(chord.children.length).toBeGreaterThan(0);
    dom = new JSDOM("<!DOCTYPE html><svg></svg>");
    (global as any).window = dom.window as unknown as Window;
    (global as any).document = dom.window.document;
  });

  test("ChordElements can be constructed", () => {
    const { ChordElements } = require("./index");
    const { createSerializedTimeAndRomanAnalysis } = require("@music-analyzer/chord-analyze");
    const { createTime } = require("@music-analyzer/time-and");

    const controllers = {
      audio: { addListeners: jest.fn() },
      window: { addListeners: jest.fn() },
      time_range: { addListeners: jest.fn() },
    };

    const romans = [
      createSerializedTimeAndRomanAnalysis(createTime(0, 1), "C", "C", "I"),
    ];

    const chord = new ChordElements(romans, controllers);
    expect(chord.children.length).toBeGreaterThan(0);
  });
});
