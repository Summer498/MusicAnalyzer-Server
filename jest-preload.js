global.console = {
  ...console,
  // uncomment to ignore a specific log level
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // error: jest.fn(),
};
if (typeof global.AudioContext === 'undefined') {
  class AudioContextMock {
    constructor() {
      this.destination = {};
      this.currentTime = 0;
      this.state = 'running';
    }
    resume() { }
    createGain() { return { gain: { value: 0 }, connect() {} }; }
    createOscillator() { return { connect() {}, start() {}, stop() {} }; }
  }
  global.AudioContext = AudioContextMock;
}
if (typeof global.document === 'undefined') {
  const createBaseElement = (tag) => ({
    tagName: String(tag).toUpperCase(),
    style: {},
    attributes: {},
    childNodes: [],
    setAttribute(name, value) { this.attributes[name] = value; },
    appendChild(node) { this.childNodes.push(node); },
    replaceChildren() { this.childNodes = Array.from(arguments); },
    get textContent() { return this._text || ''; },
    set textContent(v) { this._text = v; },
  });
  global.document = {
    createElement: (tag) => createBaseElement(tag),
    createElementNS: (_ns, tag) => createBaseElement(tag),
    createTextNode: (text) => ({ textContent: text }),
  };
}
