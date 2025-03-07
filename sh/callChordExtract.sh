(
  export PYTHONPATH="./python:"
  . ./MUSIC_ANALYZER/bin/activate

  readonly filepath="$1"
  readonly song_name="$(basename "$1" | sed -e 's/\.[^\.]*$//')"  # 引数から拡張子を取り除く

  readonly chord_ext_src="$filepath"
  readonly chord_ext_dst="./resources/$song_name/analyzed/chord/chords.json"

  python -m chordExtract "$chord_ext_src" "$chord_ext_dst"
)