"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tonal_js_1 = require("../adapters/Tonal.js");
const Math_js_1 = require("../Math/Math.js");
const stdlib_js_1 = require("../StdLib/stdlib.js");
const TonalEx_js_1 = require("../TonalEx/TonalEx.js");
const TPS_js_1 = require("./TPS.js");
const NO_DEBUG = true;
if (NO_DEBUG) {
    console.warn(`軽量化のために一時的にテストを停止しています.`);
}
const all_note_symbols = [
    "Ab", "A", "A#",
    "Bb", "B", "B#",
    "Cb", "C", "C#",
    "Db", "D", "D#",
    "Eb", "E", "E#",
    "Fb", "F", "F#",
    "Gb", "G", "G#",
];
// Range test for regionDistance
for (let i = 0; i < 21; i++) {
    if (NO_DEBUG) {
        break;
    }
    for (let j = 0; j < 21; j++) {
        const distance = (0, TPS_js_1.regionDistance)(Tonal_js_1.Scale_default.get(`${all_note_symbols[i]} major`), Tonal_js_1.Scale_default.get(`${all_note_symbols[j]} major`));
        if (distance < -6 || 6 < distance) {
            throw new Error(`regionDistance must be in range [0, 6]. received is regionDistance(${i}, ${j}) = ${distance}`);
        }
    }
}
// Range tes for root Distances
const AtoG = ["A", "B", "C", "D", "E", "F", "G"];
for (let i = 0; i < 21; i++) {
    if (NO_DEBUG) {
        break;
    }
    for (let j = 0; j < 21; j++) {
        const distance = (0, TPS_js_1.tonicDistance)(Tonal_js_1.Chord_default.get(all_note_symbols[i]), Tonal_js_1.Chord_default.get(all_note_symbols[j]));
        if (distance < -3 || 3 < distance) {
            throw new Error(`rootDistance must be in range [0, 3] received is rootDistance(${i}, ${j}) = ${distance}`);
        }
        const diff = AtoG.indexOf(all_note_symbols[i].slice(0, 1))
            - AtoG.indexOf(all_note_symbols[j].slice(0, 1));
        const correctDistance = ((diff) => {
            const dist_in_circle_of_3rd = Math_js_1.Math.mod(diff * 3, 7);
            return Math_js_1.Math.min(dist_in_circle_of_3rd, 7 - dist_in_circle_of_3rd);
        })(diff);
        if (distance !== correctDistance) {
            console.log(`i: ${all_note_symbols[i]}, j: ${all_note_symbols[j]}, ${distance} !== ${correctDistance}`);
            throw new Error("distance value is wrong");
        }
    }
}
const getTonic = (chord) => {
    return (0, stdlib_js_1.assertNonNullable)(chord.tonic);
};
const getFifth = (chord) => {
    const fifths = chord.notes
        .filter((note) => (0, TonalEx_js_1.getIntervalDegree)(getTonic(chord), note) == 5);
    new stdlib_js_1.Assertion(fifths.length == 1)
        .onFailed(() => {
        console.log(`received: ${fifths}`);
        throw new Error(`Expected just one "fifth note"`);
    });
    return fifths[0];
};
// Basic Space Test (No Borrowing)
for (const key of all_note_symbols.map(key_tonic => [
    Tonal_js_1.Key_default.majorKey(key_tonic),
    Tonal_js_1.Key_default.minorKey(key_tonic).natural
]).flat()) {
    if (NO_DEBUG) {
        break;
    }
    const scale = Tonal_js_1.Scale_default.get(key.chordScales[0]);
    const chords = key.chords
        .map((chord_str) => Tonal_js_1.Chord_default.get(chord_str));
    new stdlib_js_1.Assertion(chords.length == 7)
        .onFailed(() => {
        console.log(`received: ${chords}`);
        throw new Error(`chords.length must be 7`);
    });
    for (const chord of chords) {
        const expected_BS = Math_js_1.Math.getZeros(12)
            .map((_, i) => {
            switch (i) {
                // tonic
                case (0, TonalEx_js_1.getNonNullableChroma)(getTonic(chord)):
                    return 4;
                // fifth
                case (0, TonalEx_js_1.getNonNullableChroma)(getFifth(chord)):
                    return 3;
            }
            // chord notes
            if (chord.notes
                .map((note) => (0, TonalEx_js_1.getNonNullableChroma)(note))
                .includes(i)) {
                return 2;
            }
            // scale notes
            if (key.scale
                .map((note) => (0, TonalEx_js_1.getNonNullableChroma)(note))
                .includes(i)) {
                return 1;
            }
            // non scale notes
            return 0;
        });
        const received_BS = (0, TPS_js_1.getBasicSpace)(new TonalEx_js_1.RomanChord(scale, chord));
        new stdlib_js_1.Assertion(Math_js_1.Math.sameArray(received_BS, expected_BS))
            .onFailed(() => {
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
    Tonal_js_1.Key_default.majorKey("C"),
    Tonal_js_1.Key_default.minorKey("C").natural
]) {
    if (NO_DEBUG) {
        break;
    }
    const src_scale = Tonal_js_1.Scale_default.get(src_key.chordScales[0]);
    // 固有和音を取り出す
    const src_chord = Tonal_js_1.Chord_default.get(src_key.chords[0]);
    const src_roman = new TonalEx_js_1.RomanChord(src_scale, src_chord);
    const src_BS = (0, TPS_js_1.getBasicSpace)(src_roman);
    for (const dst_key of all_note_symbols.map(dst_key_tonic => [
        Tonal_js_1.Key_default.majorKey(dst_key_tonic),
        Tonal_js_1.Key_default.minorKey(dst_key_tonic).natural
    ]).flat()) {
        const dst_scale = Tonal_js_1.Scale_default.get(dst_key.chordScales[0]);
        // 固有和音を取り出す
        const dst_chords = dst_key.chords
            .map((chord_str) => Tonal_js_1.Chord_default.get(chord_str));
        for (const dst_chord of dst_chords) {
            const dst_roman = new TonalEx_js_1.RomanChord(dst_scale, dst_chord);
            // getBasicSpace はテスト済み関数として信用する
            const dst_BS = (0, TPS_js_1.getBasicSpace)(dst_roman);
            const expected_dist = Math_js_1.Math.totalSum(Math_js_1.Math.vSub(dst_BS, src_BS).map(e => Math_js_1.Math.max(e, 0)));
            const received_dist = (0, TPS_js_1.basicSpaceDistance)(src_roman, dst_roman);
            new stdlib_js_1.Assertion(expected_dist === received_dist)
                .onFailed(() => {
                console.log(`received: ${received_dist}`);
                console.log(`expected: ${expected_dist}`);
            });
        }
    }
}
// BS 距離の具体例
new stdlib_js_1.Assertion((0, TPS_js_1.getDistance)(new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("C")), new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("F"))) == 6).onFailed(() => { throw new Error(); });
new stdlib_js_1.Assertion((0, TPS_js_1.getDistance)(new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("C")), new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("G"))) == 6).onFailed(() => { throw new Error(); });
new stdlib_js_1.Assertion((0, TPS_js_1.getDistance)(new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("Dm")), new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("Am"))) == 6).onFailed(() => { throw new Error(); });
new stdlib_js_1.Assertion((0, TPS_js_1.getDistance)(new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("C")), new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("Am"))) == 5).onFailed(() => { throw new Error(); });
new stdlib_js_1.Assertion((0, TPS_js_1.getDistance)(new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("C")), new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("Em"))) == 5).onFailed(() => { throw new Error(); });
new stdlib_js_1.Assertion((0, TPS_js_1.getDistance)(new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("Dm")), new TonalEx_js_1.RomanChord(Tonal_js_1.Scale_default.get("C major"), Tonal_js_1.Chord_default.get("F"))) == 5).onFailed(() => { throw new Error(); });
const chord_types = Tonal_js_1.ChordDictionary.all()
    .flatMap((chord_type) => chord_type.aliases); // 要素数 100 以上
for (const note of all_note_symbols) {
    for (const chord_type of chord_types) {
        if (NO_DEBUG) {
            break;
        }
        // |all_note_symbols| * |chord_types| > 12 * 100 = 1200
        const chord = Tonal_js_1.Chord_default.get(note + chord_type);
        const chord_chromas = chord.notes.map((note) => Tonal_js_1.Note.chroma(note));
        const keys = (0, TPS_js_1.getKeysIncludeTheChord)(chord);
        new stdlib_js_1.Assertion(Math_js_1.Math.forAll(keys, key => Math_js_1.Math.isSuperSet(key.notes.map((note) => Tonal_js_1.Note.chroma(note)), chord_chromas))).onFailed(() => {
            console.log(`getKeyIncludesTheChord got a key which does not include the chord`);
            console.log(`chord:`);
            console.log(chord);
            console.log(`keys:`);
            console.log(keys);
        });
    }
}
console.log(`getKeyIncludesTheChord("C")`);
console.log((0, TPS_js_1.getKeysIncludeTheChord)(Tonal_js_1.Chord_default.get("C")) // TODO: getKeyIncludesTheChord のテスト作成    
);
console.log(`getKeyIncludesTheChord("Am7")`);
console.log((0, TPS_js_1.getKeysIncludeTheChord)(Tonal_js_1.Chord_default.get("Am7")) // TODO: getKeyIncludesTheChord のテスト作成    
);
console.log(`getKeyIncludesTheChord("CM7")`);
console.log((0, TPS_js_1.getKeysIncludeTheChord)(Tonal_js_1.Chord_default.get("CM7")) // TODO: getKeyIncludesTheChord のテスト作成    
);
console.log(`getKeyIncludesTheChord("G7")`);
console.log((0, TPS_js_1.getKeysIncludeTheChord)(Tonal_js_1.Chord_default.get("G7")) // TODO: getKeyIncludesTheChord のテスト作成    
);
//# sourceMappingURL=TPS.test.js.map