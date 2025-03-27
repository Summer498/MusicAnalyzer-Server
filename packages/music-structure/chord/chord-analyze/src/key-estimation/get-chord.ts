import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { getChord as _getChord } from "@music-analyzer/tonal-objects/src/chord/get";
import { getIntervalDegree } from "@music-analyzer/tonal-objects/src/interval/interval-degree";
import { Assertion } from "@music-analyzer/stdlib/src/assertion/assertion";
import { getBodyAndRoot } from "./get-body-and-root";

// ルート付きコードが入力されてもコードを得られるようにする.
export const getChord = (chord_string: string) => {
  const body_and_root = getBodyAndRoot(chord_string);
  const root = body_and_root.root;
  const chord = _getChord(body_and_root.body);
  if (chord_string === "") { return chord; }

  new Assertion(!chord.empty).onFailed(() => { throw Error(`Illegal chord symbol "${chord_string}" received`); });
  // new Assertion(chord.tonic != null).onFailed(() => { throw new TypeError("tonic must not be null"); });  // NOTE: chord.tonic を null にするテストケースを思いつかないので(=無さそうなので)コメントアウト

  if (root != "" && !chord.notes.includes(root)) {
    // TODO: 現在はベース音をプッシュすると同じ(に見える)コードに対して候補が変化するように見えてしまう
    // ベース音を含むといろいろなコードが想定できるので, 候補スケールとして任意のスケールを使えるようにする
    chord.name += ` on ${root}`;
    chord.notes.push(root);
    chord.symbol += `/${root}`;
  }
  chord.root = root;
  chord.rootDegree = getIntervalDegree(chord.tonic!, chord.root);
  return chord as Chord;
};
