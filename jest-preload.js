global.console = {
  ...console,
  // uncomment to ignore a specific log level
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // error: jest.fn(),
};

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

class MockAudioNode {
  connect() {}
}

class MockGainNode extends MockAudioNode {
  constructor() {
    super();
    this.gain = { value: 0 };
  }
}

class MockAnalyserNode extends MockAudioNode {
  constructor() {
    super();
    this.fftSize = 0;
  }
  getByteTimeDomainData() {}
  getFloatTimeDomainData() {}
  getByteFrequencyData() {}
  getFloatFrequencyData() {}
}

class MockMediaElementAudioSourceNode extends MockAudioNode {}

global.AudioContext = class {
  constructor() {
    this.destination = new MockAudioNode();
    this.state = 'running';
    this.currentTime = 0;
  }
  createGain() { return new MockGainNode(); }
  createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: {}, detune: {} }; }
  createMediaElementSource() { return new MockMediaElementAudioSourceNode(); }
  createAnalyser() { return new MockAnalyserNode(); }
  resume() {}
};
