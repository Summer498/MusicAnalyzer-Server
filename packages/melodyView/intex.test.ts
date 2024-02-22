import { search_items_in_range } from "../timeAnd";
import { TimeAndMelodyAnalysis } from "../melodyAnalyze";

describe("test search_melody_in_range", () => {
  const note = 0;
  const roman_name = "I";
  const melody_analysis = { gravity: [] };
  const sample: TimeAndMelodyAnalysis[] = [
    { begin: 2, end: 4, note, roman_name, melody_analysis: melody_analysis  },
    { begin: 6, end: 8, note, roman_name, melody_analysis: melody_analysis  },
    { begin: 10, end: 12, note, roman_name, melody_analysis: melody_analysis  },
    { begin: 14, end: 16, note, roman_name, melody_analysis: melody_analysis  },
    { begin: 18, end: 20, note, roman_name, melody_analysis: melody_analysis },
  ];

  test("", () => {
    expect(search_items_in_range(sample, 1, 9)).toEqual({
      begin_index: 0,
      end_index: 2,
    });
    expect(search_items_in_range(sample, 2, 9)).toEqual({
      begin_index: 0,
      end_index: 2,
    });
    expect(search_items_in_range(sample, 3, 9)).toEqual({
      begin_index: 1,
      end_index: 2,
    });

    expect(search_items_in_range(sample, 1, 5)).toEqual({
      begin_index: 0,
      end_index: 1,
    });
    expect(search_items_in_range(sample, 1, 6)).toEqual({
      begin_index: 0,
      end_index: 1,
    });
    expect(search_items_in_range(sample, 1, 7)).toEqual({
      begin_index: 0,
      end_index: 2,
    });
  });
  test("", () => {
    expect(search_items_in_range(sample, 5, 13)).toEqual({
      begin_index: 1,
      end_index: 3,
    });
    expect(search_items_in_range(sample, 6, 13)).toEqual({
      begin_index: 1,
      end_index: 3,
    });
    expect(search_items_in_range(sample, 7, 13)).toEqual({
      begin_index: 2,
      end_index: 3,
    });

    expect(search_items_in_range(sample, 5, 9)).toEqual({
      begin_index: 1,
      end_index: 2,
    });
    expect(search_items_in_range(sample, 5, 10)).toEqual({
      begin_index: 1,
      end_index: 2,
    });
    expect(search_items_in_range(sample, 5, 11)).toEqual({
      begin_index: 1,
      end_index: 3,
    });
  });
  test("", () => {
    expect(search_items_in_range(sample, 9, 17)).toEqual({
      begin_index: 2,
      end_index: 4,
    });
    expect(search_items_in_range(sample, 10, 17)).toEqual({
      begin_index: 2,
      end_index: 4,
    });
    expect(search_items_in_range(sample, 11, 17)).toEqual({
      begin_index: 3,
      end_index: 4,
    });

    expect(search_items_in_range(sample, 9, 13)).toEqual({
      begin_index: 2,
      end_index: 3,
    });
    expect(search_items_in_range(sample, 9, 14)).toEqual({
      begin_index: 2,
      end_index: 3,
    });
    expect(search_items_in_range(sample, 9, 15)).toEqual({
      begin_index: 2,
      end_index: 4,
    });
  });
  test("", () => {
    expect(search_items_in_range(sample, 13, 21)).toEqual({
      begin_index: 3,
      end_index: 5,
    });
    expect(search_items_in_range(sample, 14, 21)).toEqual({
      begin_index: 3,
      end_index: 5,
    });
    expect(search_items_in_range(sample, 15, 21)).toEqual({
      begin_index: 4,
      end_index: 5,
    });

    expect(search_items_in_range(sample, 13, 17)).toEqual({
      begin_index: 3,
      end_index: 4,
    });
    expect(search_items_in_range(sample, 13, 18)).toEqual({
      begin_index: 3,
      end_index: 4,
    });
    expect(search_items_in_range(sample, 13, 19)).toEqual({
      begin_index: 3,
      end_index: 5,
    });
  });
});
