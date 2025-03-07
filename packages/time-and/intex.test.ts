// import { search_items_begins_in_range, search_items_overlaps_range } from ".";
// import { IMelodyModel } from "@music-analyzer/melody-analyze";


describe("dummy", () => {
  test("hoge", () => {
    expect(42).toBe(42);
  });
});


/*
const note = 0;
const roman_name = "I";
const melody_analysis = { gravity: [] };
const sample: IMelodyModel[] = [
  { begin: 2, end: 4, note, roman_name, melody_analysis: melody_analysis  },
  { begin: 6, end: 8, note, roman_name, melody_analysis: melody_analysis  },
  { begin: 10, end: 12, note, roman_name, melody_analysis: melody_analysis  },
  { begin: 14, end: 16, note, roman_name, melody_analysis: melody_analysis  },
  { begin: 18, end: 20, note, roman_name, melody_analysis: melody_analysis },
];

describe("test search_melody_in_range", () => {
  test("", () => {
    expect(search_items_overlaps_range(sample, 3, 9)).toEqual({
      begin_index: 0,
      end_index: 2,
    });
    expect(search_items_overlaps_range(sample, 4, 9)).toEqual({
      begin_index: 1,
      end_index: 2,
    });
    expect(search_items_overlaps_range(sample, 5, 9)).toEqual({
      begin_index: 1,
      end_index: 2,
    });

    expect(search_items_overlaps_range(sample, 3, 5)).toEqual({
      begin_index: 0,
      end_index: 1,
    });
    expect(search_items_overlaps_range(sample, 3, 6)).toEqual({
      begin_index: 0,
      end_index: 1,
    });
    expect(search_items_overlaps_range(sample, 3, 7)).toEqual({
      begin_index: 0,
      end_index: 2,
    });
  });
  test("", () => {
    expect(search_items_overlaps_range(sample, 7, 13)).toEqual({
      begin_index: 1,
      end_index: 3,
    });
    expect(search_items_overlaps_range(sample, 8, 13)).toEqual({
      begin_index: 2,
      end_index: 3,
    });
    expect(search_items_overlaps_range(sample, 9, 13)).toEqual({
      begin_index: 2,
      end_index: 3,
    });

    expect(search_items_overlaps_range(sample, 7, 9)).toEqual({
      begin_index: 1,
      end_index: 2,
    });
    expect(search_items_overlaps_range(sample, 7, 10)).toEqual({
      begin_index: 1,
      end_index: 2,
    });
    expect(search_items_overlaps_range(sample, 7, 11)).toEqual({
      begin_index: 1,
      end_index: 3,
    });
  });
  test("", () => {
    expect(search_items_overlaps_range(sample, 11, 17)).toEqual({
      begin_index: 2,
      end_index: 4,
    });
    expect(search_items_overlaps_range(sample, 12, 17)).toEqual({
      begin_index: 3,
      end_index: 4,
    });
    expect(search_items_overlaps_range(sample, 13, 17)).toEqual({
      begin_index: 3,
      end_index: 4,
    });

    expect(search_items_overlaps_range(sample, 11, 13)).toEqual({
      begin_index: 2,
      end_index: 3,
    });
    expect(search_items_overlaps_range(sample, 11, 14)).toEqual({
      begin_index: 2,
      end_index: 3,
    });
    expect(search_items_overlaps_range(sample, 11, 15)).toEqual({
      begin_index: 2,
      end_index: 4,
    });
  });
  test("", () => {
    expect(search_items_overlaps_range(sample, 15, 21)).toEqual({
      begin_index: 3,
      end_index: 5,
    });
    expect(search_items_overlaps_range(sample, 16, 21)).toEqual({
      begin_index: 4,
      end_index: 5,
    });
    expect(search_items_overlaps_range(sample, 17, 21)).toEqual({
      begin_index: 4,
      end_index: 5,
    });

    expect(search_items_overlaps_range(sample, 15, 17)).toEqual({
      begin_index: 3,
      end_index: 4,
    });
    expect(search_items_overlaps_range(sample, 15, 18)).toEqual({
      begin_index: 3,
      end_index: 4,
    });
    expect(search_items_overlaps_range(sample, 15, 19)).toEqual({
      begin_index: 3,
      end_index: 5,
    });
  });
});

describe("test search_melody_in_range", () => {
  test("", () => {
    expect(search_items_begins_in_range(sample, 1, 9)).toEqual({
      begin_index: 0,
      end_index: 2,
    });
    expect(search_items_begins_in_range(sample, 2, 9)).toEqual({
      begin_index: 0,
      end_index: 2,
    });
    expect(search_items_begins_in_range(sample, 3, 9)).toEqual({
      begin_index: 1,
      end_index: 2,
    });

    expect(search_items_begins_in_range(sample, 1, 5)).toEqual({
      begin_index: 0,
      end_index: 1,
    });
    expect(search_items_begins_in_range(sample, 1, 6)).toEqual({
      begin_index: 0,
      end_index: 1,
    });
    expect(search_items_begins_in_range(sample, 1, 7)).toEqual({
      begin_index: 0,
      end_index: 2,
    });
  });
  test("", () => {
    expect(search_items_begins_in_range(sample, 5, 13)).toEqual({
      begin_index: 1,
      end_index: 3,
    });
    expect(search_items_begins_in_range(sample, 6, 13)).toEqual({
      begin_index: 1,
      end_index: 3,
    });
    expect(search_items_begins_in_range(sample, 7, 13)).toEqual({
      begin_index: 2,
      end_index: 3,
    });

    expect(search_items_begins_in_range(sample, 5, 9)).toEqual({
      begin_index: 1,
      end_index: 2,
    });
    expect(search_items_begins_in_range(sample, 5, 10)).toEqual({
      begin_index: 1,
      end_index: 2,
    });
    expect(search_items_begins_in_range(sample, 5, 11)).toEqual({
      begin_index: 1,
      end_index: 3,
    });
  });
  test("", () => {
    expect(search_items_begins_in_range(sample, 9, 17)).toEqual({
      begin_index: 2,
      end_index: 4,
    });
    expect(search_items_begins_in_range(sample, 10, 17)).toEqual({
      begin_index: 2,
      end_index: 4,
    });
    expect(search_items_begins_in_range(sample, 11, 17)).toEqual({
      begin_index: 3,
      end_index: 4,
    });

    expect(search_items_begins_in_range(sample, 9, 13)).toEqual({
      begin_index: 2,
      end_index: 3,
    });
    expect(search_items_begins_in_range(sample, 9, 14)).toEqual({
      begin_index: 2,
      end_index: 3,
    });
    expect(search_items_begins_in_range(sample, 9, 15)).toEqual({
      begin_index: 2,
      end_index: 4,
    });
  });
  test("", () => {
    expect(search_items_begins_in_range(sample, 13, 21)).toEqual({
      begin_index: 3,
      end_index: 5,
    });
    expect(search_items_begins_in_range(sample, 14, 21)).toEqual({
      begin_index: 3,
      end_index: 5,
    });
    expect(search_items_begins_in_range(sample, 15, 21)).toEqual({
      begin_index: 4,
      end_index: 5,
    });

    expect(search_items_begins_in_range(sample, 13, 17)).toEqual({
      begin_index: 3,
      end_index: 4,
    });
    expect(search_items_begins_in_range(sample, 13, 18)).toEqual({
      begin_index: 3,
      end_index: 4,
    });
    expect(search_items_begins_in_range(sample, 13, 19)).toEqual({
      begin_index: 3,
      end_index: 5,
    });
  });
});
*/