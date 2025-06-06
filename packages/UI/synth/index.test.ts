import { JSDOM } from "jsdom";

describe("synth module", () => {
  beforeAll(() => {
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    (global as any).window = dom.window as unknown as Window;
    (global as any).document = dom.window.document;

    class MockAudioNode {
      connect() {}
    }

    class MockGainNode extends MockAudioNode {
      gain = { value: 0, cancelScheduledValues: jest.fn(), linearRampToValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() };
    }

    class MockOscillatorNode extends MockAudioNode {
      type: OscillatorType = "sine";
      frequency = { value: 0 };
      detune = { value: 0 };
      start() {}
      stop() {}
    }

    class MockAudioContext {
      destination = new MockGainNode();
      currentTime = 0;
      createGain() { return new MockGainNode(); }
      createOscillator() { return new MockOscillatorNode(); }
    }

    (global as any).AudioContext = MockAudioContext;
  });

  test("factory functions operate without error", () => {
    const { createGain, createOscillator, play, play_note } = require("./index");
    const ctx = new AudioContext();
    const parent = ctx.destination;

    const g = createGain(ctx, parent, 0.5);
    expect(g.gain.value).toBe(0.5);

    const o = createOscillator(ctx, parent, "square", 440, 0);
    expect(o.frequency.value).toBe(440);

    expect(() => play([440], 0, 0.1)).not.toThrow();
    expect(() => play_note([440], 60, 4)).not.toThrow();
    (global as any).window = dom.window as unknown as Window;
    (global as any).document = dom.window.document;

    class MockAudioNode {
      connect() {}
    }

    class MockGainNode extends MockAudioNode {
      gain = { value: 0, cancelScheduledValues: jest.fn(), linearRampToValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() };
    }

    class MockOscillatorNode extends MockAudioNode {
      type: OscillatorType = "sine";
      frequency = { value: 0 };
      detune = { value: 0 };
      start() {}
      stop() {}
    }

    class MockAudioContext {
      destination = new MockGainNode();
      currentTime = 0;
      createGain() { return new MockGainNode(); }
      createOscillator() { return new MockOscillatorNode(); }
    }

    (global as any).AudioContext = MockAudioContext;
  });

  test("factory functions operate without error", () => {
    const { createGain, createOscillator, play, play_note } = require("./index");
    const ctx = new AudioContext();
    const parent = ctx.destination;

    const g = createGain(ctx, parent, 0.5);
    expect(g.gain.value).toBe(0.5);

    const o = createOscillator(ctx, parent, "square", 440, 0);
    expect(o.frequency.value).toBe(440);

    expect(() => play([440], 0, 0.1)).not.toThrow();
    expect(() => play_note([440], 60, 4)).not.toThrow();
  });
});
