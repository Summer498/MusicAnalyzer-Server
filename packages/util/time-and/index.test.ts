import { createTime, Time, compress, search_items_begins_in_range, search_items_overlaps_range } from "./index";

describe("Time class", () => {
  test("duration and mapping", () => {
    const t = createTime(1, 3);
    expect(t.duration).toBe(2);
    const doubled = t.map(x => x * 2);
    expect(doubled.begin).toBe(2);
    expect(doubled.end).toBe(6);
  });

  test("has method", () => {
    const t = createTime(1, 3);
    expect(t.has(2)).toBe(true);
    expect(t.has(3)).toBe(false);
  });
});

describe("compress", () => {
  test("groups consecutive items", () => {
    const result = compress(["a", "a", "b", "b", "b"]);
    expect(result).toEqual([
      { time: createTime(0, 2), item: "a" },
      { time: createTime(2, 5), item: "b" },
    ]);
  });
});

describe("search functions", () => {
  const items = [
    { time: createTime(0, 1) },
    { time: createTime(2, 3) },
    { time: createTime(4, 5) },
  ];

  test("search_items_begins_in_range", () => {
    const { begin_index, end_index } = search_items_begins_in_range(items, createTime(1, 4));
    expect(begin_index).toBe(1);
    expect(end_index).toBe(2);
  });

  test("search_items_overlaps_range", () => {
    const { begin_index, end_index } = search_items_overlaps_range(items, createTime(1.5, 4.5));
    expect(begin_index).toBe(1);
    expect(end_index).toBe(3);
  });
});
