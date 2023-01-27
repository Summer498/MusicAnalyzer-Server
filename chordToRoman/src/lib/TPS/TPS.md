# TPS のアルゴリズムの計画

## 借用和音無し・メジャー/マイナートライアドのみの場合 (1)

- 各 Lead sheet 表記コードに対して候補 scale はそのコードをダイアトニックコードに持つスケール
    - Am なら C-dur, d-moll, e-moll, F-dur, G-dur, a-moll の 6つ
    - A-moll のダイアトニックコード (A-m, B-dim, C, D-m, E-m, F, G) から割り出せる.
        - ほかのコードも同様に 6 つ候補を挙げる.
- 各候補スケールに対して Basic Space を割り出す
    - level d: そのスケールの構成音が 1 になっている onehot(12)
        - コード構成音がスケールに収まるのでスケールは変化しない
    - level c: そのコードの構成音が 1 になっている onehot(12)
    - level b: そのコードの root, 5th が 1 になっている onehot(12)
    - level a: そのコードの root が 1 になっている onehot(12)
    - `return` $\Sigma_{\forall i\in{[a-d]}} \mathrm{level}\ i$

## 借用和音無し・メジャー/マイナー/dimトライアド のみの場合 (2)
`借用和音無し・メジャー/マイナートライアドのみの場合 (1)` に加えて以下を考慮する

- `append method on` 各 Lead sheet 表記コードに対して候補 scale はそのコードをダイアトニックコードに持つスケール
    - B-dim なら a-moll, C-dur の 2 つ
    - 1 つ前のアルファベットは moll, 1 つ次のアルファベットは dur
        他の dim コードも同様に 2 つ候補を挙げる
- `keep method` 各候補スケールに対して Basic Space を割り出す
    - コード構成音がスケールに収まるのでスケールは変化しない条件は同じなので, 元とアルゴリズムは変わらない
    - level b の 5th が 5-dim (which is not P5) だが, 元アルゴリズムと同様に, コード構成音 = 5-dim のところに level b を置く

## 借用和音無しの場合 (3)
全コードが各時刻におけるスケールのダイアトニック上に配置されることが分かっているとき
`借用和音無し・メジャー/マイナー/dimトライアド のみの場合 (2)` に加えて以下を考慮する

- `append method on` 各 Lead sheet 表記コードに対して候補 scale はそのコードをダイアトニックコードに持つスケール
    - CM7 なら a-moll, C-dur, e-moll, G-dur の 4 つ
    - G7 なら a-moll, C-dur の 2 つ
    - Am7 なら a-moll, C-dur, d-moll, e-moll, F-dur, G-dur の 6 つ
    - Bm7b5 なら a-moll, C-dur の 2 つ
- `keep method` 各候補スケールに対して Basic Space を割り出す
    - level c: 7th note もコード構成音として 1 にする

<hr></hr>

## ここまでのまとめ (借用和音無しの場合)
- 各 Lead sheet 表記コードに対して候補 scale はそのコードをダイアトニックコードに持つスケール
    - 候補スケールは自然音階の長調・短調のみ
    - C なら a-moll, C-dur, d-moll, e-moll, F-dur, G-dur の 6つ
    - Am なら a-moll, C-dur, d-moll, e-moll, F-dur, G-dur の 6つ
    - B-dim なら a-moll, C-dur の 2 つ
    - CM7 なら a-moll, C-dur, e-moll, G-dur の 4 つ
    - G7 なら a-moll, C-dur の 2 つ
    - Am7 なら a-moll, C-dur, d-moll, e-moll, F-dur, G-dur の 6 つ
    - Bm7b5 なら a-moll, C-dur の 2 つ
    - sus2, sus4, 6 等の他のコードについてもダイアトニック上に乗るスケールが存在するならこの方法で考える
- 各候補スケールに対して Basic Space を割り出す
    - level d: そのスケールの構成音が 1 になっている onehot(12)
        - コード構成音がスケールに収まるのでスケールは変化しない
    - level c: そのコードの構成音が 1 になっている onehot(12)
        - 7th note もコード構成音として 1 にする
    - level b: そのコードの root, 5th が 1 になっている onehot(12)
        - 5-dim も位置を変えずに (P5 にしたりせずに) 1 にする
    - level a: そのコードの root が 1 になっている onehot(12)
    - `return` $\Sigma_{\forall i\in{[a-d]}} \mathrm{level}\ i$

<hr></hr>

## 借用和音有りの場合
TODO: TPS p.63 によると, 借用和音として解釈するか転調として解釈するのかを選好するルールが TPS chapter 5 に書いてあるらしいので読んでおく

借用和音であることが確定した後の Basic Space の作り方は以下の通り

- `obsolete` ~~各 Lead sheet 表記コードに対して候補 scale はそのコードをダイアトニックコードに持つスケール~~
- `override` 各 Lead sheet 表記コードに対して候補 scale は 12 音階の範囲内で任意のメジャー・マイナースケール
    - スケールの候補はそのコードの根音を I, #I, bII, II, #II, bIII, III, IV, #IV, bV, V, #V, bVI, VI, #VI, bVII, VII にもつメジャー・マイナースケール 34 個
        - 異名同コードは後で説明する変位後のスケールを変化させる
            - C スケール内で D#m が鳴っているとみなすと変位後のスケールが C D# E F# G A# B
            - C スケール内で Ebm が鳴っているとみなすと変位後のスケールが C D Eb F Gb A Bb
            - よって, 同じコードに対して異名同スケールを考慮する.
    - 候補が <=6 つから 34 個になったので計算量は >=5.7 倍になる.
    - // TODO: 候補スケールは 12 * 2 まで減らせるかもしれない. 
        - 具体的には: C#-dur => Db-dur と見なすのはダブルb/# を避けるためだったことを思い出すとそもそも C#-dur を候補に挙げなくてもよいのではないか

- `override` 各候補スケールに対して Basic Space を割り出す
    - level a: そのコードの root が 1 になっている onehot(12)
    - level b: そのコードの root, 5th が 1 になっている onehot(12)
        - 5-dim も位置を変えずに (P5 にしたりせずに) 1 にする
    - level c: そのコードの構成音が 1 になっている onehot(12)
        - 7th note もコード構成音として 1 にする
    - level d: そのスケールを変位させたスケールの構成音が 1 になっている onehot(12)
        - 変位のさせ方
            - 各コード構成音がスケールから見て何度に当たるのかを求める
            - 各コード構成音がスケール外にあれば, スケールの同じ度数の音を変位させる
                - 例: C-dur で D#m が鳴っている (と考えた) ときのスケール: C D# E F# G A# B
            - TODO: 和音構成音とスケール内の非和声音が重複した場合の処理をどのようにするか考えておく
                - 例: C-dur で E#-dim が鳴っている (と考えた) ときのスケール: C D **E# F** G# A B
                - 例: C-dur で F-dim が鳴っている (と考えた) ときのスケール: **Cb** D E F G Ab **B** (異名同コードを使っても重複から逃げられない例)
    - `return` $\Sigma_{\forall i\in{[a-d]}} \mathrm{level}\ i$



