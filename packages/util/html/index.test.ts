import { HTML } from "./index";

describe("html utilities", () => {
  test("HTML.p creates paragraph element", () => {
    const p = HTML.p({}, "hello");
    expect(p.tagName.toLowerCase()).toBe("p");
    expect(p.textContent).toBe("hello");
  });
});
