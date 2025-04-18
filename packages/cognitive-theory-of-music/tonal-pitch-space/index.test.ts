import { forAll } from "@music-analyzer/math/src/logic/first-order-logic/for-all"
import { getZeros } from "@music-analyzer/math/src/array/zeros"
import { isSuperSet } from "@music-analyzer/math/src/set/superset"
import { mod } from "@music-analyzer/math/src/basic-function/mod"
import { sameArray } from "@music-analyzer/math/src/array/same-array"
import { totalSum } from "@music-analyzer/math/src/reduction/sum"
import { vSub } from "@music-analyzer/math/src/vector/sub"
import { Assertion } from "@music-analyzer/stdlib/src/assertion/assertion"
import { assertNonNullable as NN } from "@music-analyzer/stdlib/src/assertion/not-null-like"
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord"
import { getChord } from "@music-analyzer/tonal-objects/src/chord/get"
import { getScale } from "@music-analyzer/tonal-objects/src/scale/get"
import { majorKey } from "@music-analyzer/tonal-objects/src/key/major-key"
import { minorKey } from "@music-analyzer/tonal-objects/src/key/minor-key"
import { getIntervalDegree } from "@music-analyzer/tonal-objects/src/interval/interval-degree"
import { getChroma } from "@music-analyzer/tonal-objects/src/note/chroma"
import { RomanChord } from "@music-analyzer/roman-chord/src/roman-chord";
import { getDistance } from "./src/get-distance"
import { tonicDistance } from "./src/tonic-distance"
import { regionDistance } from "./src/region-distance"
import { getBasicSpace } from "./src/get-basic-space"
import { basicSpaceDistance } from "./src/basic-space-distance"
import { getKeysIncludeTheChord, } from "./src/get-keys-include-the-chord"

describe("dummy", () => {
  test("dummy", () => {
    expect(1).toBe(1);
  });
});

// TODO: jest 化
const comment = () => {
  console.log(
    getDistance(
      new RomanChord(getScale("C major"), getChord("Am7")),
      new RomanChord(getScale("C major"), getChord("G7")),
    ),
  );


  const all_note_symbols = ["Ab", "A", "A#", "Bb", "B", "B#", "Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#",];
  // Range test for regionDistance
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 21; j++) {
      const distance = regionDistance(
        getScale(`${all_note_symbols[i]} major`),
        getScale(`${all_note_symbols[j]} major`),
      );
      if (distance < -6 || 6 < distance) {
        throw new Error(
          `regionDistance must be in range [0, 6]. received is regionDistance(${i}, ${j}) = ${distance}`,
        );
      }
    }
  }

  // Range tes for root Distances
  const AtoG = ["A", "B", "C", "D", "E", "F", "G"];
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 21; j++) {
      const distance = tonicDistance(
        getChord(all_note_symbols[i]),
        getChord(all_note_symbols[j]),
      );
      if (distance < -3 || 3 < distance) {
        throw new Error(`rootDistance must be in range [0, 3] received is rootDistance(${i}, ${j}) = ${distance}`);
      }
      const diff =
        AtoG.indexOf(all_note_symbols[i].slice(0, 1)) -
        AtoG.indexOf(all_note_symbols[j].slice(0, 1));
      const correctDistance = (diff => {
        const dist_in_circle_of_3rd = mod(diff * 3, 7);
        return Math.min(dist_in_circle_of_3rd, 7 - dist_in_circle_of_3rd);
      })(diff);
      if (distance !== correctDistance) {
        console.log(`i: ${all_note_symbols[i]}, j: ${all_note_symbols[j]}, ${distance} !== ${correctDistance}`,);
        throw new Error("distance value is wrong");
      }
    }
  }

  const getTonic = (chord: Chord) => {
    return NN(chord.tonic);
  };

  const getFifth = (chord: Chord) => {
    const fifths = chord.notes.filter(
      (note: string) => getIntervalDegree(getTonic(chord), note) == 5,
    );
    new Assertion(fifths.length == 1).onFailed(() => {
      console.log(`received: ${fifths}`);
      throw new Error(`Expected just one "fifth note"`);
    });
    return fifths[0];
  };

  // Basic Space Test (No Borrowing)
  for (const key of all_note_symbols
    .map(key_tonic => [
      majorKey(key_tonic),
      minorKey(key_tonic).natural,
    ])
    .flat()) {
    const scale = getScale(key.chordScales[0]);
    const chords = key.chords.map((chord_str: string) =>
      getChord(chord_str),
    );
    new Assertion(chords.length == 7).onFailed(() => {
      console.log(`received: ${chords}`);
      throw new Error(`chords.length must be 7`);
    });
    for (const chord of chords) {
      const expected_BS = getZeros(12).map((_, i) => {
        switch (i) {
          // tonic
          case getChroma(getTonic(chord)):
            return 4;
          // fifth
          case getChroma(getFifth(chord)):
            return 3;
        }
        // chord notes
        if (
          chord.notes
            .map((note: string) => getChroma(note))
            .includes(i)
        ) {
          return 2;
        }
        // scale notes
        if (
          key.scale
            .map((note: string) => getChroma(note))
            .includes(i)
        ) {
          return 1;
        }
        // non scale notes
        return 0;
      });
      const received_BS = getBasicSpace(new RomanChord(scale, chord));

      new Assertion(sameArray(received_BS, expected_BS)).onFailed(() => {
        console.log(`received: ${received_BS}`);
        console.log(`expected: ${expected_BS}`);
        throw new Error(`basic space is wrong`);
      });
    }
  }

  // BasicSpace distance test (no borrowing)
  // I/C から任意のキーの任意の固有和音までの距離についてテストする
  // 出発点 I/C も任意の Roman Chord にすると, 計算量があまりにも多くなる.
  for (const src_key of [
    majorKey("C"),
    minorKey("C").natural,
  ]) {
    const src_scale = getScale(src_key.chordScales[0]);
    // 固有和音を取り出す
    const src_chord = getChord(src_key.chords[0]);
    const src_roman = new RomanChord(src_scale, src_chord);
    const src_BS = getBasicSpace(src_roman);

    for (const dst_key of all_note_symbols
      .map(dst_key_tonic => [
        majorKey(dst_key_tonic),
        minorKey(dst_key_tonic).natural,
      ])
      .flat()) {
      const dst_scale = getScale(dst_key.chordScales[0]);
      // 固有和音を取り出す
      const dst_chords = dst_key.chords.map(chord_str => getChord(chord_str));

      for (const dst_chord of dst_chords) {
        const dst_roman = new RomanChord(dst_scale, dst_chord);
        // getBasicSpace はテスト済み関数として信用する
        const dst_BS = getBasicSpace(dst_roman);
        const expected_dist = totalSum(
          vSub(dst_BS, src_BS).map(e => Math.max(e, 0)),
        );

        const received_dist = basicSpaceDistance(src_roman, dst_roman);
        new Assertion(expected_dist === received_dist).onFailed(() => {
          console.log(`received: ${received_dist}`);
          console.log(`expected: ${expected_dist}`);
        });
      }
    }
  }
  
  
  // BS 距離の具体例
  new Assertion(
    getDistance(
      new RomanChord(getScale("C major"), getChord("C")),
      new RomanChord(getScale("C major"), getChord("F")),
    ) == 6,
  ).onFailed(() => {
    throw new Error();
  });
  new Assertion(
    getDistance(
      new RomanChord(getScale("C major"), getChord("C")),
      new RomanChord(getScale("C major"), getChord("G")),
    ) == 6,
  ).onFailed(() => {
    throw new Error();
  });
  new Assertion(
    getDistance(
      new RomanChord(getScale("C major"), getChord("Dm")),
      new RomanChord(getScale("C major"), getChord("Am")),
    ) == 6,
  ).onFailed(() => {
    throw new Error();
  });
  new Assertion(
    getDistance(
      new RomanChord(getScale("C major"), getChord("C")),
      new RomanChord(getScale("C major"), getChord("Am")),
    ) == 5,
  ).onFailed(() => {
    throw new Error();
  });
  new Assertion(
    getDistance(
      new RomanChord(getScale("C major"), getChord("C")),
      new RomanChord(getScale("C major"), getChord("Em")),
    ) == 5,
  ).onFailed(() => {
    throw new Error();
  });
  new Assertion(
    getDistance(
      new RomanChord(getScale("C major"), getChord("Dm")),
      new RomanChord(getScale("C major"), getChord("F")),
    ) == 5,
  ).onFailed(() => {
    throw new Error();
  });

  const chord_types = _ChordDictionary.all().flatMap(chord_type => chord_type.aliases); // 要素数 100 以上
  for (const note of all_note_symbols) {
    for (const chord_type of chord_types) {
      // |all_note_symbols| * |chord_types| > 12 * 100 = 1200
      const chord = getChord(note + chord_type);
      const chord_chromas = chord.notes.map(note => getChroma(note));
      const keys = getKeysIncludeTheChord(chord);
      new Assertion(
        forAll(keys, key => isSuperSet(key.notes.map(note => getChroma(note)), chord_chromas),
        ),
      ).onFailed(() => {
        console.log(
          `getKeyIncludesTheChord got a key which does not include the chord`,
        );
        console.log(`chord:`);
        console.log(chord);
        console.log(`keys:`);
        console.log(keys);
      });
    }
  }

  console.log(`getKeyIncludesTheChord("C")`);
  console.log(
    getKeysIncludeTheChord(getChord("C")), // TODO: getKeyIncludesTheChord のテスト作成
  );

  console.log(`getKeyIncludesTheChord("Am7")`);
  console.log(
    getKeysIncludeTheChord(getChord("Am7")), // TODO: getKeyIncludesTheChord のテスト作成
  );

  console.log(`getKeyIncludesTheChord("CM7")`);
  console.log(
    getKeysIncludeTheChord(getChord("CM7")), // TODO: getKeyIncludesTheChord のテスト作成
  );

  console.log(`getKeyIncludesTheChord("G7")`);
  console.log(
    getKeysIncludeTheChord(getChord("G7")), // TODO: getKeyIncludesTheChord のテスト作成
  );
};
