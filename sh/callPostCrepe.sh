(
  export PYTHONPATH="./python:"
  . ./MUSIC_ANALYZER/bin/activate

  readonly filepath="$1"
  readonly song_name="$(basename "$1" | sed -e 's/\.[^\.]*$//')"  # 引数から拡張子を取り除く

  readonly post_crepe_src="./resources/$song_name/analyzed/melody/crepe/vocals.f0.csv"
  readonly post_crepe_dst="./resources/$song_name/analyzed/melody/crepe/vocals.json"
  python -m post-crepe "$post_crepe_src" -o "$post_crepe_dst"
)
