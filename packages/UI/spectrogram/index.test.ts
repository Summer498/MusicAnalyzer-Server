import { JSDOM } from "jsdom";

describe("spectrogram module", () => {
  let dom: JSDOM;
  beforeAll(() => {
    dom = new JSDOM("<!DOCTYPE html><svg></svg>");
    (global as any).window = dom.window as unknown as Window;
    (global as any).document = dom.window.document;

    class MockAudioNode { connect() {} }
    class MockAnalyserNode extends MockAudioNode {
      fftSize = 1024;
      getByteTimeDomainData() { return new Uint8Array(1024); }
      getFloatFrequencyData() { return new Float32Array(1024); }
    }
    class MockAudioContext {
      destination = new MockAudioNode();
      createMediaElementSource() { return new MockAudioNode(); }
      createAnalyser() { return new MockAnalyserNode(); }
    }
    (global as any).AudioContext = MockAudioContext;
  });

  test("AudioViewer can be instantiated", () => {
    const { AudioViewer } = require("./index");
    const audio = { addEventListener: jest.fn() } as any;
    const registry = { addListeners: jest.fn() };
    const viewer = new AudioViewer(audio, registry);
    expect(viewer).toBeTruthy();
    expect(() => viewer.onAudioUpdate()).not.toThrow();
  });
});
