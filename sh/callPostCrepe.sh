(
  export PYTHONPATH="./python:"
  . ./MUSIC_ANALYZER/bin/activate

  readonly song_name="$1"

  readonly post_crepe_src="./resources/$song_name/analyzed/melody/crepe/vocals.f0.csv"
  readonly post_crepe_dst="./resources/$song_name/analyzed/melody/crepe/vocals.json"
  python -m post-crepe "$post_crepe_src" -o "$post_crepe_dst"
)
