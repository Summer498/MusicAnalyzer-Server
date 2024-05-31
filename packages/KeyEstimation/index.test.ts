import { ChordProgression, getChord } from ".";
import { _Chord, _Scale, Chord } from "../TonalObjects";

const empty_chord: Chord = { aliases: [], bass: "", chroma: "", empty: true, intervals: [], name: "", normalized: "", notes: [], quality: "Unknown", root: "", rootDegree: 0, setNum: NaN, symbol: "", tonic: null, type: "" };

describe("key estimation module test", () => {
  test("Illegal chord symbol", () => {
    expect(() => getChord("foo")).toThrow(`Illegal chord symbol "foo" received`);
  });
  
  test("strange chord symbol", () => {
    expect(getChord("h")).toEqual({ aliases: ["m7b5", "ø", "-7b5", "h7", "h",], bass: "", chroma: "100100100010", empty: false, intervals: ["1P", "3m", "5d", "7m",], name: "half-diminished", normalized: "100010100100", notes: [], quality: "Diminished", root: "", rootDegree: 0, setNum: 2338, symbol: "h", tonic: "", type: "half-diminished", });
  });

  test("empty chord symbol", () => {
    expect(getChord("")).toEqual(empty_chord);
  });

  test("chord symbol", () => {
    expect(getChord("D#")).toEqual({ aliases: ["M", "^", "", "maj",], bass: "", chroma: "100010010000", empty: false, intervals: ["1P", "3M", "5P",], name: "D# major", normalized: "100001000100", notes: ["D#", "F##", "A#",], quality: "Major", root: "", rootDegree: 0, setNum: 2192, symbol: "D#", tonic: "D#", type: "major", });
    expect(getChord("D#/D#")).toEqual({ aliases: ["M", "^", "", "maj",], bass: "", chroma: "100010010000", empty: false, intervals: ["1P", "3M", "5P",], name: "D# major", normalized: "100001000100", notes: ["D#", "F##", "A#",], quality: "Major", root: "D#", rootDegree: 1, setNum: 2192, symbol: "D#", tonic: "D#", type: "major", });
    expect(getChord("D#/A#")).toEqual({ aliases: ["M", "^", "", "maj",], bass: "", chroma: "100010010000", empty: false, intervals: ["1P", "3M", "5P",], name: "D# major", normalized: "100001000100", notes: ["D#", "F##", "A#",], quality: "Major", root: "A#", rootDegree: 5, setNum: 2192, symbol: "D#", tonic: "D#", type: "major", });
    expect(getChord("D#/C")).toEqual({ aliases: ["M", "^", "", "maj",], bass: "", chroma: "100010010000", empty: false, intervals: ["1P", "3M", "5P",], name: "D# major on C", normalized: "100001000100", notes: ["D#", "F##", "A#", "C"], quality: "Major", root: "C", rootDegree: 7, setNum: 2192, symbol: "D#/C", tonic: "D#", type: "major", });
  });

  test("Canon progression", () => {
    const progression = new ChordProgression(["CM7", "G7", "Am7", "Em7", "FM7", "CM7", "FM7", "G7"]);
    const candidate_scales = progression.lead_sheet_chords.map(
      (e, t) => progression.getStatesOnTime(t)
    );
    expect(candidate_scales.map(e => e.map(e => e.name))).toEqual(
      [
        ["C major", "G major"],            // CM7
        ["C major"],                       // G7
        ["C major", "F major", "G major"], // Am7
        ["C major", "D major", "G major"], // Em7
        ["C major", "F major"],            // FM7
        ["C major", "G major"],            // CM7
        ["C major", "F major"],            // FM7
        ["C major"]                        // G7
      ]);
    progression.getMinimumPath();
    expect(progression.getMinimumPath().map(e => e.map(e => ({ chord: e.chord.name, roman: e.roman, scale: e.scale.name })))).toEqual(
      [
        [{ chord: "C major seventh", roman: "I major seventh", scale: "C major" }],
        [{ chord: "G dominant seventh", roman: "V dominant seventh", scale: "C major" }],
        [{ chord: "A minor seventh", roman: "VI minor seventh", scale: "C major" }],
        [{ chord: "E minor seventh", roman: "III minor seventh", scale: "C major" }],
        [{ chord: "F major seventh", roman: "IV major seventh", scale: "C major" }],
        [{ chord: "C major seventh", roman: "I major seventh", scale: "C major" }],
        [{ chord: "F major seventh", roman: "IV major seventh", scale: "C major" }],
        [{ chord: "G dominant seventh", roman: "V dominant seventh", scale: "C major" }]
      ]
    );
  });

  test("progression includes mM7 chord", () => {
    const progression = new ChordProgression(["GM7", "GmM7", "F#m7", "Bm7", "A7", "DM7"]);
    const candidate_scales = progression.lead_sheet_chords.map(
      (e, t) => progression.getStatesOnTime(t)
    );
    expect(candidate_scales.map(e => e.map(e => e.name))).toEqual(
      [
        ["D major", "G major"],            // GM7
        [""],                              // GmM7 TODO: fix: ここで候補がなくなってしまう
        ["D major", "E major", "A major"], // F#7
        ["D major", "G major", "A major"], // Bm7
        ["D major"],                       // A7
        ["D major", "A major"]             // DM7
      ]
    );
    expect(progression.getMinimumPath().map(e => e.map(e => ({ chord: e.chord.name, roman: e.roman, scale: e.scale.name })))).toEqual(
      [
        [
          { chord: "G major seventh", roman: "IV major seventh", scale: "D major" },
          { chord: "G major seventh", roman: "I major seventh", scale: "G major" }
        ],
        [{ chord: "G minor/major seventh", roman: "G minor/major seventh", scale: "" }],  // TODO: fix: 候補がないのでローマ数字も書けない
        [{ chord: "F# minor seventh", roman: "III minor seventh", scale: "D major" }],
        [{ chord: "B minor seventh", roman: "VI minor seventh", scale: "D major" },],
        [{ chord: "A dominant seventh", roman: "V dominant seventh", scale: "D major" }],
        [{ chord: "D major seventh", roman: "I major seventh", scale: "D major" }]]
    );
  });

  test("Just the Two of Us Progression", () => {
    const progression = new ChordProgression(["DbM7", "C7", "Fm7", "Ebm7", "Ab7"]);
    const candidate_scales = progression.lead_sheet_chords.map(
      (e, t) => progression.getStatesOnTime(t)
    );
    expect(candidate_scales.map(e => e.map(e => e.name))).toEqual(
      [
        ["Db major", "Ab major"],
        ["F major"],
        ["Db major", "Eb major", "Ab major"],
        ["Db major", "Gb major", "B major"],
        ["Db major"]
      ]
    );
    // TODO: fix 和声的短音階のドミナントを借用している箇所が適切に判定されない (2番目は Ab minor の III7)
    expect(progression.getMinimumPath().map(e => e.map(e => ({ chord: e.chord.name, roman: e.roman, scale: e.scale.name })))).toEqual(
      [
        [{ chord: "Db major seventh", roman: "IV major seventh", scale: "Ab major" }],
        [{ chord: "C dominant seventh", roman: "V dominant seventh", scale: "F major" }],
        [
          { chord: "F minor seventh", roman: "III minor seventh", scale: "Db major" },
          { chord: "F minor seventh", roman: "II minor seventh", scale: "Eb major" },
          { chord: "F minor seventh", roman: "VI minor seventh", scale: "Ab major" }
        ],
        [{ chord: "Eb minor seventh", roman: "II minor seventh", scale: "Db major" }],
        [{ chord: "Ab dominant seventh", roman: "V dominant seventh", scale: "Db major" }]
      ]
    );
  });
});
