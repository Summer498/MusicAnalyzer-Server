import { Math } from "../Math";
import { getIntervalDegree, getNonNullableChroma, RomanChord } from "../TonalEx";
import { assertNonNullable, Assertion, NotImplementedError } from "../StdLib";
import Scale_default from "@tonaljs/scale";
import { Chord } from "@tonaljs/chord";
import { Scale } from "@tonaljs/scale";
import Key_default from "@tonaljs/key";
import Note from "@tonaljs/note";
// eslint-disable-next-line @typescript-eslint/no-explicit-any

const regionDistanceInChromaNumber = (src: number, dst: number) => {
	return Math.abs(Math.mod((dst - src) * 7 + 6, 12) - 6);
};

export const regionDistance = (src: Scale, dst: Scale) => {
	const src_chroma = getNonNullableChroma(assertNonNullable(src.tonic));
	const dst_chroma = getNonNullableChroma(assertNonNullable(dst.tonic));

	const region_dist = regionDistanceInChromaNumber(src_chroma, dst_chroma);
	return region_dist;
};

const tonicDistanceInChromaNumber = (src: number, dst: number) => {
	return Math.abs(Math.mod((dst - src) * 3 + 3, 7) - 3);
};

export const tonicDistance = (src: Chord, dst: Chord) => {
	const interval = getIntervalDegree(
		assertNonNullable(src.tonic),
		assertNonNullable(dst.tonic)
	);
	const dist_in_circle_of_3rd = Math.mod((interval - 1) * 3, 7);
	return Math.min(dist_in_circle_of_3rd, 7 - dist_in_circle_of_3rd);
};

const getTonicChroma = (chord: Chord) => {
	const tonic = assertNonNullable(chord.tonic);
	return [getNonNullableChroma(tonic)];
};

const getPowerChroma = (chord: Chord) => {
	const tonic = assertNonNullable(chord.tonic);
	const fifths = chord.notes
		.filter(note => getIntervalDegree(tonic, note) == 5);
	new Assertion(fifths.length == 1)
		.onFailed(() => {
			console.log(`received:`);
			console.log(chord.notes);
			throw new Error("received chord must have just one 5th code.");
		});
	return [tonic, fifths[0]].map(note => getNonNullableChroma(note));
};

const getChordChroma = (chord: Chord) => {
	return chord.notes.map(note => getNonNullableChroma(note));
};

const getScaleChroma = (roman: RomanChord) => {
	// TODO: 借用和音に伴いスケール構成音を変異させる
	new Assertion(Math.isSubSet(
		roman.chord.notes.map(note => getNonNullableChroma(note)),
		roman.scale.notes.map(note => getNonNullableChroma(note)))
	)
		.onFailed(() => {
			console.log(`received:`);
			console.log(roman);
			throw new NotImplementedError("借用和音はまだ実装されていません. 入力ローマ数字コードは, コード構成音がスケール内に収まるようにしてください.");
		});
	return roman.scale.notes.map(note => getNonNullableChroma(note));
};

export const getBasicSpace = (roman: RomanChord) => {
	new Assertion(!roman.scale.empty)
		.onFailed(() => {
			console.log(`received:`);
			console.log(roman.scale);
			throw new Error("scale must not be empty");
		});
	new Assertion(!roman.chord.empty)
		.onFailed(() => {
			console.log(`received:`);
			console.log(roman.chord);
			throw new Error("chord must not be empty");
		});

	const basic_space = Math.vSum(
		Math.getOnehot(getTonicChroma(roman.chord), 12),
		Math.getOnehot(getPowerChroma(roman.chord), 12),
		Math.getOnehot(getChordChroma(roman.chord), 12),
		Math.getOnehot(getScaleChroma(roman), 12)
	);
	return basic_space;
};

export const basicSpaceDistance = (src: RomanChord, dst: RomanChord) => {
	const src_bs = getBasicSpace(src);
	const dst_bs = getBasicSpace(dst);
	const incremented = Math.vSub(dst_bs, src_bs)
		.filter(e => e > 0);
	return Math.totalSum(incremented);
	// TODO: 遠隔調の例外処理 (がそもそも必要なのか?)
};


export const getDistance = (src_chord_string: RomanChord, dst_chord_string: RomanChord): number => {
	const src = src_chord_string;
	const dst = dst_chord_string;
	const region_dist = regionDistance(src.scale, dst.scale);
	const tonic_dist = tonicDistance(src.chord, dst.chord);
	const basic_space_dist = basicSpaceDistance(src, dst);
	return region_dist + tonic_dist + basic_space_dist; //dummy
};

const c_minor = Key_default.minorKey("C").natural;
type KeyScale = typeof c_minor;
const isKeyIncludesTheChord = (key: KeyScale, chord: Chord) => {
	const key_note_chromas = key.scale.map((note: any) => Note.chroma(note));
	const chord_note_chromas = chord.notes.map(note => Note.chroma(note));
	return Math.isSuperSet(key_note_chromas, chord_note_chromas);
};

// 最も尤もらしいコード進行を見つける
const major_keys = ['Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B',].map(key => Scale_default.get(key + " major"));
const minor_keys = ['Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#',].map(key => Scale_default.get(key + " minor"));
const keys = major_keys.concat(minor_keys);
const chroma2symbol = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// TODO: minor Major 7 を受け取ることがあるので, 任意のキーを候補として使えるようにする. 
export const getKeysIncludeTheChord = (chord: Chord) => {
	const keys_includes_the_chord = chroma2symbol
		.flatMap(symbol => [Key_default.majorKey(symbol), Key_default.minorKey(symbol).natural])
		.filter(key => isKeyIncludesTheChord(key, chord))
		.map(key => Scale_default.get(key.chordScales[0]));
	return keys_includes_the_chord;
};

const getMostLikelyChordProgression = (chord_progression: string[]) => {
	/*
	const possible_keys = chord_progression.forEach(chord => getKeyIncludesTheChord(chord));
	return undefined;
	*/
};

























// c-spell:disable
/* eslint-disable deprecation/deprecation */
// BEGIN: 古いやつ
/** @deprecated */
export const Key_quality = {
	major: [0, 2, 4, 5, 7, 9, 11],
	minor: [0, 2, 3, 5, 7, 8, 10]
};

/*
export const Chroma = {
	Cflat: 11, C: 0, Csharp: 1,
	Dflat: 1, D: 2, Dsharp: 3,
	Eflat: 3, E: 4, Esharp: 5,
	Fflat: 4, F: 5, Fsharp: 6,
	Gflat: 6, G: 7, Gsharp: 8,
	Aflat: 8, A: 9, Asharp: 10,
	Bflat: 10, B: 11, Bsharp: 0,
};
*/

/** @deprecated */
export const Chord_index = {
	none: { rmv: [], add: [] },
	seventh: { rmv: [], add: [7] },
	ninth: { rmv: [], add: [7, 9] },
	added6: { rmv: [5], add: [6] },
	added46: { rmv: [3, 5], add: [4, 6] },
};

/** @deprecated */
export const Alt5 = {
	dim5: -1,
	none: 0,
	aug5: 1
};

//TODO: +46, +6 要る?
/**
 * @brief get Basic Space of chord
 * @param {number} key key in which chord is (key is like Chroma.Fsharp)
 * @param {number[]} key_quality key in which chord is (key_quality is like Key_quality.major)
 * @param {number} degree degree of chord in the key (degree is in {1,2,...,7})
 * @param {{rmv:(number|never)[],add:(number|never)[]}} chord_index indexes of chord: one of {0, 6, 7, 9} (default:0)
 * @param {number} alt5 of chord in the key: one of {-1, 0, 1} (default:0)
 * @return {number[]} Basic Space of chord
 */
/** @deprecated */
/*
export const oldGetBasicSpace = (
	key: number,
	key_quality: number[],
	degree: number,
	chord_index: { rmv: (number | never)[], add: (number | never)[] } = Chord_index.none,
	alt5 = 0
) => {
	//TODO:
	console.assert(degree !== undefined);
	const d = degree;
	console.log(key_quality);
	console.log(Math.v_add(key_quality, key));
	console.log(Math.v_mod(Math.v_add(key_quality, key), 12));
	const s = Math.v_mod(Math.v_add(key_quality, key), 12);
	s[4] += alt5;

	const code_tone = Math.removeFromArray(Math.genArr(3, i => 2 * i + 1), chord_index.rmv).concat(chord_index.add);
	const c = Math.v_get(s, Math.v_mod(Math.v_add(code_tone, d - 2), 7));
	const leveld = Math.getOnehot(s, 12);
	const levelc = Math.getOnehot(c, 12);
	const levelb = Math.getOnehot([c[0], c[2]], 12);
	const levela = Math.getOnehot([c[0]], 12);
	return Math.v_sum(leveld, levelc, levelb, levela);
};
*/

/**
 * @brief distance of BS in chord distance function
 * @param {number[]} src pitch class of source chord's BS
 * @param {number[]} dst pitch class of destination chord's BS
 * @return {number} count of additional pitch class in dst from src
 */
/** @deprecated */
/*
export const basicSpaceDist = (src: number[], dst: number[]) => {
	let sum = 0;
	Math.v_sub(dst, src).map(e => { sum += Math.max(0, e); return sum; });
	return sum;
};
*/

/** @deprecated */
/*
export const chordDist = (
	src: {
		key: number,
		quality: number[],
		degree: number,
		indexes: { rmv: (number | never)[], add: (number | never)[] }
		alt5: number
	},
	dst: {
		key: number,
		quality: number[],
		degree: number,
		indexes: { rmv: (number | never)[], add: (number | never)[] }
		alt5: number
	}
) => {
	// TODO: 遠隔調の例外処理
	return regionDistanceInChromaNumber(src.key, dst.key)
		+ tonicDistanceInChromaNumber(src.degree, dst.degree)
		+ basicSpaceDist(
			oldGetBasicSpace(src.key, src.quality, src.degree, src.indexes, src.alt5),
			oldGetBasicSpace(dst.key, dst.quality, dst.degree, dst.indexes, dst.alt5)
		);
};
*/
// TODO: もう少し Tonaljs friendly に書く


// END: 古いやつ

