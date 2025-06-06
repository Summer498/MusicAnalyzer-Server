import { JSDOM } from "jsdom";

let dom: JSDOM;

describe("piano-roll beat-view", () => {
  beforeAll(() => {
    dom = new JSDOM("<!DOCTYPE html><svg></svg>");
    (global as any).window = dom.window as unknown as Window;
    (global as any).document = dom.window.document;
  });

  test("BeatElements can be constructed", () => {
    const { BeatElements } = require("./index");
    const { createTime } = require("@music-analyzer/time-and");

    const controllers = {
      audio: { addListeners: jest.fn() },
      window: { addListeners: jest.fn() },
      time_range: { addListeners: jest.fn() },
    };

    const beat_info = { tempo: 120, phase: 0 };
    const melodies = [{ time: createTime(0, 1) }];

    const beat = new BeatElements(beat_info, melodies, controllers);
    expect(beat.beat_bars instanceof window.SVGGElement).toBe(true);
  });
});
