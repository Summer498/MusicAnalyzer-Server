(
  export PYTHONPATH="./python:"
  . ./MUSIC_ANALYZER/bin/activate

  readonly song_name="$1"

  readonly crepe_src="./resources/$song_name/demucs/vocals.wav"
  readonly crepe_tmp="./resources/$song_name/demucs//vocals.f0.csv"
  readonly crepe_dst="./resources/$song_name/analyzed/melody/crepe/vocals.f0.csv"

  python -m crepe "$crepe_src" >&2
  if [ -e "$crepe_dst" ]; then rmdir "$crepe_dst"; fi
  mv "$crepe_tmp" "$crepe_dst"
)